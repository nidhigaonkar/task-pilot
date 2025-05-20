
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Link, Clock, Bell, Edit, X } from "lucide-react";
import { formatDate, getDaysUntilDue, getTaskUrgency } from "@/lib/utils";
import { Task } from "@/lib/types";
import { useTaskContext } from "@/contexts/TaskContext";
import TaskEditDialog from "./TaskEditDialog";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { completeTask, uncompleteTask, accessLevel } = useTaskContext();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const daysUntilDue = getDaysUntilDue(task.dueDate);
  const urgency = getTaskUrgency(task.dueDate);
  const isAdmin = accessLevel === "admin";
  
  const urgencyClasses = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-green-100 text-green-800 border-green-200"
  };

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <Card className={`task-card border-l-4 ${
        task.completed 
          ? "border-l-green-500 completed-task" 
          : `border-l-${urgency === "high" ? "red" : urgency === "medium" ? "yellow" : "blue"}-500`
      }`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className={task.completed ? "line-through text-gray-500" : ""}>{task.title}</CardTitle>
            <Badge variant="outline" className={urgencyClasses[urgency]}>
              {daysUntilDue < 0 
                ? "Overdue" 
                : daysUntilDue === 0 
                  ? "Due Today" 
                  : `Due in ${daysUntilDue} day${daysUntilDue !== 1 ? "s" : ""}`
              }
            </Badge>
          </div>
          <CardDescription className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> 
            {formatDate(task.dueDate)} • 
            {isAdmin ? `Assigned to: ${task.assignedTo} (${task.assignedRole})` : `Role: ${task.assignedRole}`}
            {task.assignedBy && (
              <span className="ml-1">• Assigned by: {task.assignedBy}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">{task.description}</p>
          
          {isAdmin && task.reminderSettings && (
            <div className="mt-2 bg-purple-50 p-2 rounded-md">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Bell className="h-3 w-3" /> Reminders: 
                {task.reminderSettings.daysBeforeDue.map((day, index) => (
                  <span key={index} className="bg-purple-100 text-purple-700 px-1 rounded-sm">
                    {day} day{day !== 1 ? "s" : ""}
                  </span>
                )).reduce((prev, curr, i) => i === 0 ? [curr] : [...prev, ', ', curr], [] as React.ReactNode[])}
              </div>
            </div>
          )}
          
          {task.links && task.links.length > 0 && (
            <div className="mt-2">
              {task.links.map((link, index) => (
                <a 
                  key={index}
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <Link className="h-3 w-3" /> {new URL(link).hostname}
                </a>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          {!task.completed ? (
            <Button 
              variant="outline" 
              size="sm" 
              className={isAdmin ? "w-1/2" : "w-full"} 
              onClick={() => completeTask(task.id)}
            >
              <Check className="mr-1 h-4 w-4" /> Mark Complete
            </Button>
          ) : (
            <>
              {isAdmin ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-1/2" 
                  onClick={() => uncompleteTask(task.id)}
                >
                  <X className="mr-1 h-4 w-4" /> Mark Incomplete
                </Button>
              ) : (
                <p className="text-sm text-green-600 w-full text-center">
                  <Check className="inline mr-1 h-4 w-4" /> Completed
                </p>
              )}
            </>
          )}
          
          {isAdmin && (
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-1/2" 
              onClick={handleEditClick}
            >
              <Edit className="mr-1 h-4 w-4" /> Edit Task
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {isEditDialogOpen && (
        <TaskEditDialog 
          task={task} 
          isOpen={isEditDialogOpen} 
          onClose={() => setIsEditDialogOpen(false)} 
        />
      )}
    </>
  );
};

export default TaskCard;
