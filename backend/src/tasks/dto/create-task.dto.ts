import { PriorityLevel, TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  title: string;
  description?: string;
  dueDate?: Date;
  status?: TaskStatus;
  priority?: PriorityLevel;
}
