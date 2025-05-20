import { Task, Role } from "./types";

export const MOCK_PASSWORD = "clubmanager";
export const MOCK_PASSWORDS = {
  admin: "founder",
  member: "leads"
};

export const MOCK_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Prepare meeting agenda",
    description: "Create an agenda for our next club meeting covering the upcoming event planning.",
    dueDate: "2025-06-01T12:00:00Z",
    assignedTo: "secretary@example.com",
    assignedRole: "secretary",
    completed: false,
    links: ["https://docs.google.com/document/example-link"],
    reminderSettings: {
      daysBeforeDue: [3, 1],
      reminderMessage: "Don't forget to prepare the meeting agenda!"
    }
  },
  {
    id: "task-2",
    title: "Submit budget proposal",
    description: "Prepare and submit the budget proposal for the next semester to the student council.",
    dueDate: "2025-06-03T12:00:00Z",
    assignedTo: "treasurer@example.com",
    assignedRole: "treasurer",
    completed: false,
    reminderSettings: {
      daysBeforeDue: [3, 1],
      reminderMessage: "Remember to submit the budget proposal soon."
    }
  },
  {
    id: "task-3",
    title: "Book venue for end-of-year event",
    description: "Contact the student center to reserve a space for our end-of-year celebration.",
    dueDate: "2025-05-25T12:00:00Z",
    assignedTo: "vice-president@example.com",
    assignedRole: "vice-president",
    completed: true,
    reminderSettings: {
      daysBeforeDue: [3, 1],
      reminderMessage: "Please book the venue for our end-of-year event."
    }
  },
  {
    id: "task-4",
    title: "Update club website",
    description: "Add the latest events and photos to the club website.",
    dueDate: "2025-05-28T12:00:00Z",
    assignedTo: "member@example.com",
    assignedRole: "member",
    completed: false,
    links: ["https://club-website.example.com/admin"],
    reminderSettings: {
      daysBeforeDue: [3, 1],
      reminderMessage: "Remember to update our club website."
    }
  },
  {
    id: "task-5",
    title: "Send thank you emails",
    description: "Send thank you emails to guest speakers from last event.",
    dueDate: "2025-05-26T12:00:00Z",
    assignedTo: "president@example.com",
    assignedRole: "president",
    completed: false,
    reminderSettings: {
      daysBeforeDue: [3, 1],
      reminderMessage: "Don't forget to send thank you emails to our guest speakers."
    }
  }
];

export const ROLES: Role[] = ["president", "vice-president", "secretary", "treasurer", "member", "all"];

export const REMINDER_SETTINGS = {
  daysBeforeDue: [3, 1],
  reminderMessage: "This is a reminder that your task is due soon. Please complete it as soon as possible."
};
