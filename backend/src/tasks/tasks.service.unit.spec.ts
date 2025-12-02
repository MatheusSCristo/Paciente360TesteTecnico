/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PriorityLevel, TaskStatus } from './entities/task.entity';
import { InvalidDateException } from './exceptions/InvalidDateException';
import { TaskNotFoundException } from './exceptions/TaskNotFoundException';
import { TasksService } from './tasks.service';

type UpdateCallArgs = {
  where: { id: string };
  data: { completedAt?: Date | null; status?: TaskStatus; title?: string };
};

describe('TasksService - Testes Unitários', () => {
  let service: TasksService;

  const mockPrismaService = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);

    jest.clearAllMocks();
  });

  describe('Data Inválida ao criar Task', () => {
    it('deve rejeitar data com formato inválido', async () => {
      const invalidDto: CreateTaskDto = {
        title: 'Task com data inválida',
        dueDate: new Date('data'),
      };

      await expect(service.create(invalidDto)).rejects.toThrow(
        InvalidDateException,
      );
      await expect(service.create(invalidDto)).rejects.toThrow(
        'Data limite inválida',
      );

      expect(mockPrismaService.task.create).not.toHaveBeenCalled();
    });

    it('deve rejeitar tarefas com data limite no passado', async () => {
      const pastDto: CreateTaskDto = {
        title: 'Task com data no passado',
        dueDate: new Date('2020-01-01'),
      };

      await expect(service.create(pastDto)).rejects.toThrow(
        InvalidDateException,
      );
      await expect(service.create(pastDto)).rejects.toThrow(
        'A data limite não pode ser no passado',
      );

      expect(mockPrismaService.task.create).not.toHaveBeenCalled();
    });

    it('deve aceitar tarefas com data limite no futuro', async () => {
      const validDto: CreateTaskDto = {
        title: 'Task com data no futuro',
        dueDate: new Date('2026-12-31'),
      };

      mockPrismaService.task.create.mockResolvedValue({
        id: '1',
        ...validDto,
        description: '',
        status: TaskStatus.TO_DO,
        priority: PriorityLevel.MEDIUM,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(service.create(validDto)).resolves.not.toThrow();

      expect(mockPrismaService.task.create).toHaveBeenCalledTimes(1);
    });

    it('deve aceitar tarefas sem data limite', async () => {
      const noDateDto: CreateTaskDto = {
        title: 'Task sem data',
      };

      mockPrismaService.task.create.mockResolvedValue({
        id: '1',
        title: 'Task sem data',
        description: '',
        status: TaskStatus.TO_DO,
        priority: PriorityLevel.MEDIUM,
        dueDate: null,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(service.create(noDateDto)).resolves.not.toThrow();
      expect(mockPrismaService.task.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('Validação de Data ao Atualizar Task', () => {
    const existingTask = {
      id: '1',
      title: 'Task Existente',
      description: 'desc',
      status: TaskStatus.TO_DO,
      priority: PriorityLevel.MEDIUM,
      dueDate: new Date('2026-01-01'),
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('Deve rejeitar atualização com formato de data inválido', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(existingTask);

      const invalidUpdate: UpdateTaskDto = {
        dueDate: new Date('data'),
      };

      await expect(service.update('1', invalidUpdate)).rejects.toThrow(
        InvalidDateException,
      );

      expect(mockPrismaService.task.update).not.toHaveBeenCalled();
    });

    it('Deve rejeitar atualização com data limite no passado', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(existingTask);

      const pastUpdate: UpdateTaskDto = {
        dueDate: new Date('2020-01-01'),
      };

      await expect(service.update('1', pastUpdate)).rejects.toThrow(
        InvalidDateException,
      );
      await expect(service.update('1', pastUpdate)).rejects.toThrow(
        'A data limite não pode ser no passado',
      );

      expect(mockPrismaService.task.update).not.toHaveBeenCalled();
    });

    it('Deve aceitar atualização com data limite no futuro', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(existingTask);
      mockPrismaService.task.update.mockResolvedValue({
        ...existingTask,
        dueDate: new Date('2027-01-01'),
      });

      const validUpdate: UpdateTaskDto = {
        dueDate: new Date('2027-01-01'),
      };

      await expect(service.update('1', validUpdate)).resolves.not.toThrow();
      expect(mockPrismaService.task.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('Transições de Status e CompletedAt', () => {
    it('Deve definir completedAt ao mudar para status DONE', async () => {
      const todoTask = {
        id: '1',
        title: 'Task',
        description: '',
        status: TaskStatus.TO_DO,
        priority: PriorityLevel.MEDIUM,
        dueDate: null,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.task.findUnique.mockResolvedValue(todoTask);
      mockPrismaService.task.update.mockImplementation(({ data }) => {
        return Promise.resolve({
          ...todoTask,
          ...data,
        });
      });

      await service.update('1', { status: TaskStatus.DONE });

      const updateCall = mockPrismaService.task.update.mock
        .calls[0][0] as UpdateCallArgs;
      expect(updateCall.data.completedAt).toBeInstanceOf(Date);
      expect(updateCall.data.completedAt).not.toBeNull();
    });

    it('Deve limpar completedAt ao mudar de DONE para outro status', async () => {
      const doneTask = {
        id: '1',
        title: 'Task',
        description: '',
        status: 'DONE',
        priority: PriorityLevel.MEDIUM,
        dueDate: null,
        completedAt: new Date('2025-11-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.task.findUnique.mockResolvedValue(doneTask);
      mockPrismaService.task.update.mockImplementation(({ data }) => {
        return Promise.resolve({
          ...doneTask,
          ...data,
        });
      });

      await service.update('1', { status: TaskStatus.TO_DO });

      const updateCall = mockPrismaService.task.update.mock
        .calls[0][0] as UpdateCallArgs;
      expect(updateCall.data.completedAt).toBeNull();
    });

    it('Não deve modificar completedAt ao transitar entre status não-DONE', async () => {
      const todoTask = {
        id: '1',
        title: 'Task',
        description: '',
        status: TaskStatus.TO_DO,
        priority: PriorityLevel.MEDIUM,
        dueDate: null,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.task.findUnique.mockResolvedValue(todoTask);
      mockPrismaService.task.update.mockImplementation(({ data }) => {
        return Promise.resolve({
          ...todoTask,
          ...data,
        });
      });

      await service.update('1', { status: TaskStatus.DOING });

      const updateCall = mockPrismaService.task.update.mock
        .calls[0][0] as UpdateCallArgs;
      expect(updateCall.data.completedAt).toBeNull();
    });

    it('Não deve modificar completedAt ao transitar entre status não-DONE', async () => {
      const doneTask = {
        id: '1',
        title: 'Task',
        description: '',
        status: 'DONE',
        priority: PriorityLevel.MEDIUM,
        dueDate: null,
        completedAt: new Date('2025-11-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.task.findUnique.mockResolvedValue(doneTask);
      mockPrismaService.task.update.mockImplementation(({ data }) => {
        return Promise.resolve({
          ...doneTask,
          ...data,
        });
      });

      await service.update('1', {
        title: 'Novo titulo',
        status: TaskStatus.DONE,
      });

      const updateCall = mockPrismaService.task.update.mock
        .calls[0][0] as UpdateCallArgs;
      expect(updateCall.data.completedAt).toBeInstanceOf(Date);
    });
  });

  describe(' Tratamento de Erros', () => {
    it('Deve lançar TaskNotFoundException quando a tarefa não existir (findOne)', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.findOne('id')).rejects.toThrow(
        TaskNotFoundException,
      );
    });

    it('Deve lançar TaskNotFoundException quando a tarefa não existir (update)', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.update('id', { title: 'Updated' })).rejects.toThrow(
        TaskNotFoundException,
      );

      expect(mockPrismaService.task.update).not.toHaveBeenCalled();
    });

    it('Deve lançar TaskNotFoundException quando a tarefa não existir (delete)', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.delete('id')).rejects.toThrow(TaskNotFoundException);

      expect(mockPrismaService.task.delete).not.toHaveBeenCalled();
    });
  });
});
