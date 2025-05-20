
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTaskContext } from "@/contexts/TaskContext";
import { ReminderSettings } from "@/lib/types";
import { Plus, Minus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const AddTaskButton: React.FC = () => {
  const { addTask } = useTaskContext();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [assignedBy, setAssignedBy] = useState("");
  const [links, setLinks] = useState("");
  const [reminderDays, setReminderDays] = useState<number[]>([3, 1]);
  const [reminderMessage, setReminderMessage] = useState("Don't forget to complete your assigned task!");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!dueDate) newErrors.dueDate = "Due date is required";
    if (!assignedTo.trim()) newErrors.assignedTo = "Email is required";
    if (assignedTo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(assignedTo)) {
      newErrors.assignedTo = "Valid email is required";
    }
    if (assignedBy && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(assignedBy)) {
      newErrors.assignedBy = "Valid email is required";
    }
    if (reminderDays.length === 0) {
      newErrors.reminderDays = "At least one reminder day is required";
    }
    if (!reminderMessage.trim()) {
      newErrors.reminderMessage = "Reminder message is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Process links
    const linkList = links
      .split(/[\n,]/)
      .map(link => link.trim())
      .filter(link => link.length > 0);

    const reminderSettings: ReminderSettings = {
      daysBeforeDue: reminderDays,
      reminderMessage
    };

    addTask({
      title,
      description,
      dueDate: new Date(dueDate).toISOString(),
      assignedTo,
      assignedBy: assignedBy || undefined,
      links: linkList.length > 0 ? linkList : undefined,
      reminderSettings
    });
    
    // Reset form and close dialog
    setTitle("");
    setDescription("");
    setDueDate("");
    setAssignedTo("");
    setAssignedBy("");
    setLinks("");
    setReminderDays([3, 1]);
    setReminderMessage("Don't forget to complete your assigned task!");
    setErrors({});
    setOpen(false);
  };

  const addReminderDay = () => {
    setReminderDays([...reminderDays, 0]);
  };

  const removeReminderDay = (index: number) => {
    setReminderDays(reminderDays.filter((_, i) => i !== index));
  };

  const updateReminderDay = (index: number, value: string) => {
    const newDays = [...reminderDays];
    newDays[index] = parseInt(value) || 0;
    setReminderDays(newDays);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>Create a new task for your club members.</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <ScrollArea className="flex-1 px-6 py-2">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className={errors.title ? "text-destructive" : ""}>
                  Title {errors.title && <span className="text-sm">({errors.title})</span>}
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={errors.title ? "border-destructive" : ""}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description" className={errors.description ? "text-destructive" : ""}>
                  Description {errors.description && <span className="text-sm">({errors.description})</span>}
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={errors.description ? "border-destructive" : ""}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="dueDate" className={errors.dueDate ? "text-destructive" : ""}>
                  Due Date {errors.dueDate && <span className="text-sm">({errors.dueDate})</span>}
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={errors.dueDate ? "border-destructive" : ""}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="assignedTo" className={errors.assignedTo ? "text-destructive" : ""}>
                  Assigned To (Email) {errors.assignedTo && <span className="text-sm">({errors.assignedTo})</span>}
                </Label>
                <Input
                  id="assignedTo"
                  type="email"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className={errors.assignedTo ? "border-destructive" : ""}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="assignedBy" className={errors.assignedBy ? "text-destructive" : ""}>
                  Assigned By (Email) {errors.assignedBy && <span className="text-sm">({errors.assignedBy})</span>}
                </Label>
                <Input
                  id="assignedBy"
                  type="email"
                  value={assignedBy}
                  onChange={(e) => setAssignedBy(e.target.value)}
                  className={errors.assignedBy ? "border-destructive" : ""}
                  placeholder="Your email (optional)"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="links">
                  Links (Optional - one per line or comma-separated)
                </Label>
                <Textarea
                  id="links"
                  value={links}
                  onChange={(e) => setLinks(e.target.value)}
                  placeholder="https://example.com&#10;https://another-link.com"
                />
              </div>
              
              {/* Reminder Settings */}
              <div className="space-y-4 border rounded-md p-4 bg-gray-50">
                <h3 className="font-medium">Reminder Settings</h3>
                
                <div className="grid gap-2">
                  <Label className={errors.reminderDays ? "text-destructive" : ""}>
                    Reminder Days Before Due Date
                    {errors.reminderDays && <span className="text-sm ml-1">({errors.reminderDays})</span>}
                  </Label>
                  <div className="space-y-2">
                    {reminderDays.map((days, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input 
                          type="number" 
                          value={days}
                          min="0" 
                          max="30" 
                          onChange={(e) => updateReminderDay(index, e.target.value)}
                          className="w-20"
                        />
                        <span>days before</span>
                        {reminderDays.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeReminderDay(index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addReminderDay}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Reminder
                    </Button>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="reminderMessage" className={errors.reminderMessage ? "text-destructive" : ""}>
                    Reminder Message
                    {errors.reminderMessage && <span className="text-sm ml-1">({errors.reminderMessage})</span>}
                  </Label>
                  <Textarea
                    id="reminderMessage"
                    value={reminderMessage}
                    onChange={(e) => setReminderMessage(e.target.value)}
                    placeholder="Enter the reminder message"
                    className={errors.reminderMessage ? "border-destructive" : ""}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter className="p-6 pt-2 sticky bottom-0 bg-background border-t">
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskButton;
