
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTaskContext } from "@/contexts/TaskContext";
import { ROLES } from "@/lib/mock-data";
import { Role } from "@/lib/types";

const AddTaskButton: React.FC = () => {
  const { addTask } = useTaskContext();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedRole, setAssignedRole] = useState<Role>("member");
  const [assignedTo, setAssignedTo] = useState("");
  const [links, setLinks] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!dueDate) newErrors.dueDate = "Due date is required";
    if (!assignedRole) newErrors.assignedRole = "Role is required";
    if (!assignedTo.trim()) newErrors.assignedTo = "Email is required";
    if (assignedTo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(assignedTo)) {
      newErrors.assignedTo = "Valid email is required";
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

    addTask({
      title,
      description,
      dueDate: new Date(dueDate).toISOString(),
      assignedRole,
      assignedTo,
      links: linkList.length > 0 ? linkList : undefined
    });
    
    // Reset form and close dialog
    setTitle("");
    setDescription("");
    setDueDate("");
    setAssignedRole("member");
    setAssignedTo("");
    setLinks("");
    setErrors({});
    setOpen(false);
  };

  const filteredRoles = ROLES.filter(role => role !== "all");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>Create a new task for your club members.</DialogDescription>
          </DialogHeader>
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
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="role" className={errors.assignedRole ? "text-destructive" : ""}>
                  Assigned Role {errors.assignedRole && <span className="text-sm">({errors.assignedRole})</span>}
                </Label>
                <Select 
                  value={assignedRole} 
                  onValueChange={(value) => setAssignedRole(value as Role)}
                >
                  <SelectTrigger className={errors.assignedRole ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1).replace("-", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
          </div>
          <DialogFooter>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskButton;
