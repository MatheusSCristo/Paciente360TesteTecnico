import { Injectable } from '@nestjs/common';
import { ApiResponse } from '../common/responses/ApiResponse';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';
import { InvalidDateException } from './exceptions/InvalidDateException';
import { TaskNotFoundException } from './exceptions/TaskNotFoundException';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    const { title, description, priority, dueDate, status } = createTaskDto;

    const dueDateObj = new Date(dueDate || '');
    if (dueDate) {
      if (isNaN(dueDateObj.getTime())) {
        throw new InvalidDateException('Data limite inválida');
      }
      if (dueDateObj < new Date()) {
        throw new InvalidDateException('A data limite não pode ser no passado');
      }
    }

    const task = new Task({
      title,
      description,
      priority,
      dueDate: dueDate ? dueDateObj : undefined,
      status,
    });

    const createdTask = await this.prismaService.task.create({
      data: task,
    });

    return ApiResponse.success({
      message: 'Tarefa criada com sucesso',
      data: createdTask,
    });
  }

  async findAll(page = 1, perPage = 10) {
    // 1. Converta para número para evitar erros de "string * string" ou validação do Prisma
    const pageNumber = Number(page) || 1;
    const perPageNumber = Number(perPage) || 10;

    const skip = (pageNumber - 1) * perPageNumber;

    const [tasks, total] = await Promise.all([
      this.prismaService.task.findMany({
        skip,
        take: perPageNumber, // Prisma exige Int aqui
      }),
      this.prismaService.task.count(),
    ]);

    const totalPages = Math.ceil(total / perPageNumber);

    return ApiResponse.successPaginated({
      data: tasks,
      meta: {
        total,
        perPage: perPageNumber,
        totalPages,
        page: pageNumber,
      },
      message: 'Tarefas recuperadas com sucesso',
    });
  }

  async findOne(id: string) {
    const task = await this.prismaService.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new TaskNotFoundException();
    }

    return ApiResponse.success({
      message: 'Tarefa recuperada com sucesso',
      data: task,
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.prismaService.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new TaskNotFoundException();
    }

    const dueDateObj = new Date(updateTaskDto.dueDate || '');
    if (updateTaskDto.dueDate) {
      if (isNaN(dueDateObj.getTime())) {
        throw new InvalidDateException('Data limite inválida');
      }
      if (dueDateObj < new Date()) {
        throw new InvalidDateException('A data limite não pode ser no passado');
      }
      updateTaskDto.dueDate = dueDateObj;
    }

    let completedAt: Date | null = null;
    if (updateTaskDto.status == TaskStatus.DONE) {
      completedAt = new Date();
    }
    if (task.status === 'DONE' && updateTaskDto.status !== TaskStatus.DONE) {
      completedAt = null;
    }

    const updatedTask = await this.prismaService.task.update({
      where: { id },
      data: {
        ...updateTaskDto,
        completedAt,
      },
    });

    return ApiResponse.success({
      message: 'Tarefa atualizada com sucesso',
      data: updatedTask,
    });
  }

  async delete(id: string) {
    const task = await this.prismaService.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new TaskNotFoundException();
    }

    await this.prismaService.task.delete({
      where: { id },
    });

    return ApiResponse.success({
      message: 'Tarefa deletada com sucesso',
    });
  }

  async getStats() {
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    const [pending, overdue, completedThisWeek] = await Promise.all([
      this.prismaService.task.count({
        where: {
          status: {
            not: TaskStatus.DONE,
          },
          completedAt: null,
        },
      }),
      this.prismaService.task.count({
        where: {
          status: {
            not: TaskStatus.DONE,
          },
          completedAt: null,
          dueDate: {
            lt: now,
          },
        },
      }),
      this.prismaService.task.count({
        where: {
          completedAt: {
            gte: oneWeekAgo,
            lte: now,
          },
        },
      }),
    ]);

    return ApiResponse.success({
      message: 'Estatísticas recuperadas com sucesso',
      data: {
        pending,
        overdue,
        completedThisWeek,
      },
    });
  }
}
