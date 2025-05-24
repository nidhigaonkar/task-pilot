export type Role = "president" | "vice-president" | "secretary" | "treasurer" | "member" | "all";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO format
  assignedTo?: string; // legacy, for backward compatibility
  assignedToEmail: string[]; // Changed from string to string[] to support multiple emails
  completed: boolean;
  links?: string[];
  reminderSettings: ReminderSettings;
  assignedBy?: string; // legacy, for backward compatibility
  assignedByName?: string; // for both leads and admins
}

export interface ReminderSettings {
  daysBeforeDue: number[];
  reminderMessage: string;
}

export type AccessLevel = "member" | "admin";
