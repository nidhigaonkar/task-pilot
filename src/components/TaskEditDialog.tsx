import React from "react";
import { useForm } from "react-hook-form";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Save, Trash2 } from "lucide-react";
import { Task } from "@/lib/types";
import { REMINDER_SETTINGS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useTaskContext } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TaskEditDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

interface ReminderDaysInput {
  days: string;
}

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({ task, isOpen, onClose }) => {
  const { updateTask, deleteTask, accessLevel } = useTaskContext();
  
  // Ensure task has reminderSettings with defaults if undefined
  const taskWithDefaults: Task = {
    ...task,
    reminderSettings: task.reminderSettings || {
      daysBeforeDue: [3, 1],
      reminderMessage: REMINDER_SETTINGS.reminderMessage
    }
  };

  const form = useForm<Task & ReminderDaysInput>({
    defaultValues: {
      ...taskWithDefaults,
      assignedToEmail: Array.isArray(taskWithDefaults.assignedToEmail) 
        ? taskWithDefaults.assignedToEmail.join(', ')
        : taskWithDefaults.assignedToEmail || "",
      assignedByName: taskWithDefaults.assignedByName || "",
      days: taskWithDefaults.reminderSettings.daysBeforeDue.join(", ")
    }
  });

  const onSubmit = (data: Task & ReminderDaysInput) => {
    // Convert comma-separated string of days to array of numbers
    const daysArray = data.days
      .split(",")
      .map(day => parseInt(day.trim()))
      .filter(day => !isNaN(day));

    // Convert comma-separated string of emails to array
    const emailArray = data.assignedToEmail
      .split(/[\n,]/)
      .map(email => email.trim())
      .filter(email => email);

    const updatedTask: Task = {
      ...data,
      assignedToEmail: emailArray,
      assignedByName: data.assignedByName,
      reminderSettings: {
        daysBeforeDue: daysArray,
        reminderMessage: data.reminderSettings.reminderMessage || REMINDER_SETTINGS.reminderMessage
      }
    };

    updateTask(updatedTask);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      deleteTask(task.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col p-0 box-border rounded-lg overflow-hidden">
        <DialogHeader className="p-6 pb-2 flex flex-row items-center justify-between">
          <DialogTitle>Edit Task</DialogTitle>
          {accessLevel === "admin" && (
            <Button type="button" variant="ghost" size="icon" onClick={handleDelete} title="Delete Task">
              <Trash2 className="h-5 w-5 text-destructive" />
            </Button>
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full min-h-0">
            <ScrollArea className="flex-1 min-h-0 overflow-auto px-6">
              <div className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assignedToEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign To (Email Addresses)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter email addresses (one per line or comma-separated)"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter multiple email addresses separated by commas or new lines
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assignedByName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned By (Name)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(parseISO(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? parseISO(field.value) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(date.toISOString());
                              }
                            }}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reminder Days Before Due (comma-separated)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="3, 1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reminderSettings.reminderMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reminder Message</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            <DialogFooter className="p-6 pt-2 pb-4 mt-auto bg-background border-t">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditDialog;
