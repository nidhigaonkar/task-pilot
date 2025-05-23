import React, { createContext, useState, useContext, useEffect } from "react";
import { Task, Role, AccessLevel } from "@/lib/types";
import { MOCK_TASKS, MOCK_PASSWORDS } from "@/lib/mock-data";
import { generateTaskId } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface TaskContextType {
  tasks: Task[];
  isAuthenticated: boolean;
  accessLevel: AccessLevel | null;
  selectedRole: Role;
  addTask: (task: Omit<Task, "id" | "completed">) => void;
  completeTask: (id: string) => void;
  uncompleteTask: (id: string) => void;
  updateTask: (task: Task) => void;
  setSelectedRole: (role: Role) => void;
  authenticate: (password: string) => boolean;
  logout: () => void;
  showCompletedTasks: boolean;
  setShowCompletedTasks: (show: boolean) => void;
  filteredTasks: Task[];
  deleteTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessLevel, setAccessLevel] = useState<AccessLevel | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>("all");
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const { toast } = useToast();

  // Fetch tasks from backend on mount
  useEffect(() => {
    fetch('http://localhost:3001/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const filteredTasks = tasks
    .filter(task => 
      (selectedRole === "all") && 
      (showCompletedTasks || !task.completed)
    )
    .sort((a, b) => {
      // If both tasks have the same completion status, maintain their original order
      if (a.completed === b.completed) return 0;
      // Put incomplete tasks first
      return a.completed ? 1 : -1;
    });

  // Add task using backend
  const addTask = (task: Omit<Task, "id" | "completed">) => {
    fetch('http://localhost:3001/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTasks(prev => [...prev, data.task]);
    toast({
      title: "Task Added",
            description: `"${data.task.title}" has been added successfully.`
          });
        } else {
          toast({
            title: "Failed to Add Task",
            description: data.error || 'Unknown error',
            variant: "destructive"
          });
        }
    });
  };

  const completeTask = (id: string) => {
    fetch(`http://localhost:3001/api/tasks/${id}/complete`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTasks(prev => 
            prev.map(task => 
              task.id === id ? { ...task, completed: true } : task
            )
          );
          
          const taskToComplete = tasks.find(task => task.id === id);
          if (taskToComplete) {
            toast({
              title: "Task Completed",
              description: `"${taskToComplete.title}" marked as completed.`,
            });
          }
        } else {
          toast({
            title: "Failed to Complete Task",
            description: data.error || 'Unknown error',
            variant: "destructive"
          });
        }
      })
      .catch(err => {
        toast({
          title: "Failed to Complete Task",
          description: err.message,
          variant: "destructive"
        });
      });
  };

  const uncompleteTask = (id: string) => {
    fetch(`http://localhost:3001/api/tasks/${id}/uncomplete`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTasks(prev => 
            prev.map(task => 
              task.id === id ? { ...task, completed: false } : task
            )
          );
          
          const taskToUncomplete = tasks.find(task => task.id === id);
          if (taskToUncomplete) {
            toast({
              title: "Task Status Updated",
              description: `"${taskToUncomplete.title}" marked as incomplete.`,
            });
          }
        } else {
          toast({
            title: "Failed to Update Task",
            description: data.error || 'Unknown error',
            variant: "destructive"
          });
        }
      })
      .catch(err => {
        toast({
          title: "Failed to Update Task",
          description: err.message,
          variant: "destructive"
        });
      });
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );

    toast({
      title: "Task Updated",
      description: `"${updatedTask.title}" has been updated.`,
    });
  };

  const authenticate = (password: string) => {
    if (password === MOCK_PASSWORDS.admin) {
      setIsAuthenticated(true);
      setAccessLevel("admin");
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the IntelliHer Task Manager!",
      });
      return true;
    } else if (password === "leads") {
      setIsAuthenticated(true);
      setAccessLevel("member");
      toast({
        title: "Member Access Granted",
        description: "Welcome to the IntelliHer Task Manager!",
      });
      return true;
    }
    
    toast({
      title: "Authentication Failed",
      description: "Please check the password and try again.",
      variant: "destructive",
    });
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAccessLevel(null);
    toast({
      title: "Logged Out",
      description: "You have been logged out of the system.",
    });
  };

  const deleteTask = (id: string) => {
    fetch(`http://localhost:3001/api/tasks/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTasks(prev => prev.filter(task => task.id !== id));
          toast({
            title: "Task Deleted",
            description: `The task has been deleted.`,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Failed to Delete Task",
            description: data.error || 'Unknown error',
            variant: "destructive"
          });
        }
      })
      .catch(err => {
        toast({
          title: "Failed to Delete Task",
          description: err.message,
          variant: "destructive"
        });
      });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isAuthenticated,
        accessLevel,
        selectedRole,
        addTask,
        completeTask,
        uncompleteTask,
        updateTask,
        setSelectedRole,
        authenticate,
        logout,
        showCompletedTasks,
        setShowCompletedTasks,
        filteredTasks,
        deleteTask
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}
