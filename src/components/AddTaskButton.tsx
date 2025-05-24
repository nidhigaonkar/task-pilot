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
import { ReminderSettings, Role } from "@/lib/types";
import { Plus, Minus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLES } from "@/lib/mock-data";

interface AddTaskButtonProps {
  className?: string;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ className }) => {
  const { addTask, accessLevel } = useTaskContext();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedToEmail, setAssignedToEmail] = useState("");
  const [assignedByName, setAssignedByName] = useState("");
  const [assignedBy, setAssignedBy] = useState("");
  const [assignedRole, setAssignedRole] = useState<Role>("member");
  const [links, setLinks] = useState("");
  const [reminderDays, setReminderDays] = useState<number[]>([3, 1]);
  const [reminderMessage, setReminderMessage] = useState("Don't forget to complete your assigned task!");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!dueDate) newErrors.dueDate = "Due date is required";
    if (!assignedToEmail.trim()) newErrors.assignedToEmail = "At least one email is required";
    
    // Validate each email address
    const emailList = assignedToEmail.split(/[\n,]/).map(email => email.trim()).filter(email => email);
    const invalidEmails = emailList.filter(email => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    if (invalidEmails.length > 0) {
      newErrors.assignedToEmail = "One or more email addresses are invalid";
    }
    
    if (!assignedByName.trim()) newErrors.assignedByName = "Your name is required";
    if (reminderDays.length === 0) {
      newErrors.reminderDays = "At least one reminder day is required";
    }
    if (!reminderMessage.trim()) {
      newErrors.reminderMessage = "Reminder message is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const emailList = assignedToEmail
      .split(/[\n,]/)
      .map(email => email.trim())
      .filter(email => email);
      
    const linkList = links
      .split(/[\n,]/)
      .map(link => link.trim())
      .filter(link => link.length > 0);
      
    const reminderSettings: ReminderSettings = {
      daysBeforeDue: reminderDays,
      reminderMessage
    };
    
    await addTask({
      title,
      description,
      dueDate: new Date(dueDate).toISOString(),
      assignedToEmail: emailList,
      assignedByName,
      links: linkList.length > 0 ? linkList : undefined,
      reminderSettings
    });
    
    setTitle("");
    setDescription("");
    setDueDate("");
    setAssignedToEmail("");
    setAssignedByName("");
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
        <Button className={className}>Add New Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[90vh] flex flex-col p-0 box-border rounded-lg overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>Create a new task for your club members.</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0">
          <ScrollArea className="flex-1 min-h-0 overflow-auto px-6">
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
              
              {/* Only Assigned To (Email) field for all users */}
              <div className="grid gap-2">
                <Label htmlFor="assignedToEmail" className={errors.assignedToEmail ? "text-destructive" : ""}>
                  Assign To (Email Addresses)
                  {errors.assignedToEmail && <span className="text-sm ml-1">({errors.assignedToEmail})</span>}
                </Label>
                <Textarea
                  id="assignedToEmail"
                  value={assignedToEmail}
                  onChange={(e) => setAssignedToEmail(e.target.value)}
                  placeholder="Enter email addresses (one per line or comma-separated)"
                  className={errors.assignedToEmail ? "border-destructive" : ""}
                />
                <p className="text-sm text-gray-500">Enter multiple email addresses separated by commas or new lines</p>
              </div>
              
              {/* Assigned By (Name) for all users */}
              <div className="grid gap-2">
                <Label htmlFor="assignedByName" className={errors.assignedByName ? "text-destructive" : ""}>
                  Assigned By (Name) {errors.assignedByName && <span className="text-sm">({errors.assignedByName})</span>}
                </Label>
                <Input
                  id="assignedByName"
                  value={assignedByName}
                  onChange={(e) => setAssignedByName(e.target.value)}
                  className={errors.assignedByName ? "border-destructive" : ""}
                  placeholder="Your name"
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
          
          <DialogFooter className="p-6 pt-2 pb-4 mt-auto bg-background border-t">
            <Button type="submit">Done</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskButton;
