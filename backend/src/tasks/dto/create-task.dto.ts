import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PriorityLevel, TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Título é obrigatório' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'status deve ser TO_DO, DOING ou DONE' })
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(PriorityLevel, { message: 'priority deve ser LOW, MEDIUM ou HIGH' })
  priority?: PriorityLevel;

  @IsOptional()
  dueDate?: Date;
}
