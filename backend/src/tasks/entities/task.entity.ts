export enum TaskStatus {
  TO_DO = 'TO_DO',
  DOING = 'DOING',
  DONE = 'DONE',
}

export enum PriorityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export class Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: Date;
  priority: PriorityLevel;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
