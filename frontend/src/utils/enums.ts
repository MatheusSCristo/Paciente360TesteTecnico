export const TaskStatus = {
  TO_DO: "TO_DO",
  DOING: "DOING",
  DONE: "DONE",
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export const PriorityLevel = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export type PriorityLevel = typeof PriorityLevel[keyof typeof PriorityLevel];