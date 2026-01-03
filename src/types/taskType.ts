export interface task {
    id?: string; 
    name: string;
    description: string;
    deadline: string; 
    status: taskStatus;
    priority: taskPriority;
}
export default task;

export enum taskStatus {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
}
export enum taskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}
