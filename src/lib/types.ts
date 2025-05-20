
export type Role = "president" | "vice-president" | "secretary" | "treasurer" | "member" | "all";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO format
  assignedTo: string; // email
  completed: boolean;
  links?: string[];
  reminderSettings: ReminderSettings;
  assignedBy?: string; // email of person who created/assigned the task
}

export interface ReminderSettings {
  daysBeforeDue: number[];
  reminderMessage: string;
}

export type AccessLevel = "member" | "admin";
