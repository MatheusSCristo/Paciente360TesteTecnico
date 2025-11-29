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
  constructor({
    title,
    description,
    priority,
    dueDate,
  }: {
    title: string;
    description?: string;
    priority?: PriorityLevel;
    dueDate?: Date;
  }) {
    this.title = title;
    this.description = description || '';
    this.status = TaskStatus.TO_DO;
    this.dueDate = dueDate || null;
    this.priority = priority || PriorityLevel.MEDIUM;
    this.completedAt = null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: Date | null;
  priority: PriorityLevel;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
