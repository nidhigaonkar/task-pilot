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

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessLevel, setAccessLevel] = useState<AccessLevel | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>("all");
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const { toast } = useToast();

  // Load tasks from localStorage if available
  useEffect(() => {
    const storedTasks = localStorage.getItem("club-tasks");
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (error) {
        console.error("Error parsing tasks from localStorage:", error);
        // Fall back to mock data if parsing fails
        setTasks(MOCK_TASKS);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("club-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = tasks.filter(task => 
    (selectedRole === "all") && 
    (showCompletedTasks || !task.completed)
  );

  const addTask = (task: Omit<Task, "id" | "completed">) => {
    const newTask: Task = {
      ...task,
      id: generateTaskId(),
      completed: false
    };
    
    setTasks(prev => [...prev, newTask]);
    toast({
      title: "Task Added",
      description: `"${task.title}" has been added successfully.`
    });
  };

  const completeTask = (id: string) => {
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
  };

  const uncompleteTask = (id: string) => {
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
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Task Deleted",
      description: `The task has been deleted.`,
      variant: "destructive"
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
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
