
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Task, Role } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function getDaysUntilDue(dueDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

export function filterTasksByRole(tasks: Task[], role: Role): Task[] {
  if (role === "all") {
    return tasks;
  }
  return tasks.filter(task => task.assignedRole === role);
}

export function getTaskUrgency(dueDate: string): "high" | "medium" | "low" {
  const daysUntilDue = getDaysUntilDue(dueDate);
  
  if (daysUntilDue <= 1) {
    return "high";
  } else if (daysUntilDue <= 3) {
    return "medium";
  } else {
    return "low";
  }
}

export function generateTaskId(): string {
  return `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function shouldSendReminder(daysUntilDue: number, reminderDays: number[]): boolean {
  return reminderDays.includes(daysUntilDue);
}
