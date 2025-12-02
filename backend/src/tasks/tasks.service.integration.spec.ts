import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PriorityLevel, TaskStatus } from './entities/task.entity';
import { InvalidDateException } from './exceptions/InvalidDateException';
import { TaskNotFoundException } from './exceptions/TaskNotFoundException';
import { TasksService } from './tasks.service';
import { TestDatabaseSetup } from './test-helpers/test-db-setup';

describe('TasksService - Testes de Integração', () => {
  let service: TasksService;
  let testDb: TestDatabaseSetup;
  let createdTaskIds: string[] = [];

  jest.setTimeout(60000);

  beforeAll(async () => {
    testDb = new TestDatabaseSetup();
    const prismaClient = await testDb.setup();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: prismaClient,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  afterAll(async () => {
    await testDb.teardown();
  });

  afterEach(async () => {
    await testDb.cleanup();
    createdTaskIds = [];
  });

  describe('create', () => {
    it('deve criar uma tarefa no banco de dados', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Integration Test Task',
        description: 'Testing database integration',
        priority: PriorityLevel.HIGH,
        status: TaskStatus.TO_DO,
        dueDate: new Date('2025-12-31'),
      };

      const result = await service.create(createTaskDto);

      expect(result.data).toBeDefined();
      expect(result.data?.id).toBeDefined();
      expect(result.data?.title).toBe('Integration Test Task');
      expect(result.data?.priority).toBe(PriorityLevel.HIGH);

      if (result.data?.id) {
        createdTaskIds.push(result.data.id);
      }

      const prisma = testDb.getPrismaClient();
      const taskInDb = await prisma.task.findUnique({
        where: { id: result.data?.id },
      });

      expect(taskInDb).toBeDefined();
      expect(taskInDb?.title).toBe('Integration Test Task');
    });

    it('deve criar uma tarefa com campos mínimos obrigatórios', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Minimal Task',
      };

      const result = await service.create(createTaskDto);

      expect(result.data).toBeDefined();
      expect(result.data?.title).toBe('Minimal Task');
      expect(result.data?.status).toBe(TaskStatus.TO_DO);
      expect(result.data?.priority).toBe(PriorityLevel.MEDIUM);

      if (result.data?.id) {
        createdTaskIds.push(result.data.id);
      }
    });

    it('deve lançar erro para data inválida', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Invalid Date Task',
        dueDate: new Date('invalid'),
      };

      await expect(service.create(createTaskDto)).rejects.toThrow(
        InvalidDateException,
      );
    });

    it('deve lançar erro para data no passado', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Past Date',
        dueDate: new Date('2020-01-01'),
      };

      await expect(service.create(createTaskDto)).rejects.toThrow(
        InvalidDateException,
      );
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      const task1 = await service.create({
        title: 'Task 1 for pagination',
        priority: PriorityLevel.LOW,
      });
      const task2 = await service.create({
        title: 'Task 2 for pagination',
        priority: PriorityLevel.MEDIUM,
      });
      const task3 = await service.create({
        title: 'Task 3 for pagination',
        priority: PriorityLevel.HIGH,
      });

      if (task1.data?.id) createdTaskIds.push(task1.data.id);
      if (task2.data?.id) createdTaskIds.push(task2.data.id);
      if (task3.data?.id) createdTaskIds.push(task3.data.id);
    });

    it('deve retornar tarefas paginadas do banco de dados', async () => {
      const result = await service.findAll(1, 10);

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.meta).toBeDefined();
      expect(result.meta?.page).toBe(1);
      expect(result.meta?.perPage).toBe(10);
      expect(result.meta?.total).toBe(3);
    });

    it('deve lidar com paginação corretamente', async () => {
      const result = await service.findAll(1, 2);

      expect(result.data).toBeDefined();
      expect(result.data?.length).toBeLessThanOrEqual(2);
      expect(result.meta?.perPage).toBe(2);
    });
  });

  describe('findOne', () => {
    it('deve encontrar uma tarefa por id do banco de dados', async () => {
      const created = await service.create({
        title: 'Find One Test Task',
        description: 'Testing findOne method',
      });

      if (created.data?.id) {
        createdTaskIds.push(created.data.id);

        const result = await service.findOne(created.data.id);

        expect(result.data).toBeDefined();
        expect(result.data?.id).toBe(created.data.id);
        expect(result.data?.title).toBe('Find One Test Task');
      }
    });

    it('deve lançar TaskNotFoundException para id inexistente', async () => {
      await expect(
        service.findOne('00000000-0000-0000-0000-000000000000'),
      ).rejects.toThrow(TaskNotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar uma tarefa no banco de dados', async () => {
      const created = await service.create({
        title: 'Original Title',
        description: 'Original Description',
        priority: PriorityLevel.LOW,
      });

      if (created.data?.id) {
        createdTaskIds.push(created.data.id);

        const updateDto: UpdateTaskDto = {
          title: 'Updated Title',
          description: 'Updated Description',
          priority: PriorityLevel.HIGH,
        };

        const result = await service.update(created.data.id, updateDto);

        expect(result.data).toBeDefined();
        expect(result.data?.title).toBe('Updated Title');
        expect(result.data?.description).toBe('Updated Description');
        expect(result.data?.priority).toBe(PriorityLevel.HIGH);

        const prisma = testDb.getPrismaClient();
        const taskInDb = await prisma.task.findUnique({
          where: { id: created.data.id },
        });

        expect(taskInDb?.title).toBe('Updated Title');
      }
    });

    it('deve definir completedAt ao mudar status para DONE', async () => {
      const created = await service.create({
        title: 'Task to Complete',
        status: TaskStatus.TO_DO,
      });

      if (created.data?.id) {
        createdTaskIds.push(created.data.id);

        const result = await service.update(created.data.id, {
          status: TaskStatus.DONE,
        });

        expect(result.data?.status).toBe(TaskStatus.DONE);
        expect(result.data?.completedAt).toBeDefined();
        expect(result.data?.completedAt).toBeInstanceOf(Date);

        const prisma = testDb.getPrismaClient();
        const taskInDb = await prisma.task.findUnique({
          where: { id: created.data.id },
        });

        expect(taskInDb?.completedAt).toBeDefined();
      }
    });

    it('deve limpar completedAt ao mudar status de DONE', async () => {
      const created = await service.create({
        title: 'Task to Uncomplete',
        status: TaskStatus.TO_DO,
      });

      if (created.data?.id) {
        createdTaskIds.push(created.data.id);

        await service.update(created.data.id, {
          status: TaskStatus.DONE,
        });

        const result = await service.update(created.data.id, {
          status: TaskStatus.TO_DO,
        });

        expect(result.data?.status).toBe(TaskStatus.TO_DO);
        expect(result.data?.completedAt).toBeNull();

        const prisma = testDb.getPrismaClient();
        const taskInDb = await prisma.task.findUnique({
          where: { id: created.data.id },
        });

        expect(taskInDb?.completedAt).toBeNull();
      }
    });

    it('deve lançar TaskNotFoundException para tarefa inexistente', async () => {
      await expect(
        service.update('00000000-0000-0000-0000-000000000000', {
          title: 'Updated',
        }),
      ).rejects.toThrow(TaskNotFoundException);
    });

    it('deve lançar erro para dueDate no passado', async () => {
      const created = await service.create({
        title: 'Task with Future Date',
        dueDate: new Date('2025-12-31'),
      });

      if (created.data?.id) {
        createdTaskIds.push(created.data.id);

        await expect(
          service.update(created.data.id, {
            dueDate: new Date('2020-01-01'),
          }),
        ).rejects.toThrow(InvalidDateException);
      }
    });
  });

  describe('delete', () => {
    it('deve deletar uma tarefa do banco de dados', async () => {
      const created = await service.create({
        title: 'Task to Delete',
        description: 'This task will be deleted',
      });

      if (created.data?.id) {
        const result = await service.delete(created.data.id);

        expect(result.message).toBe('Tarefa deletada com sucesso');

        const prisma = testDb.getPrismaClient();
        const taskInDb = await prisma.task.findUnique({
          where: { id: created.data.id },
        });

        expect(taskInDb).toBeNull();
      }
    });

    it('deve lançar TaskNotFoundException para tarefa inexistente', async () => {
      await expect(
        service.delete('00000000-0000-0000-0000-000000000000'),
      ).rejects.toThrow(TaskNotFoundException);
    });
  });
});
