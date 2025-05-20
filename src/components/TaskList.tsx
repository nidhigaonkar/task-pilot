
import React from "react";
import TaskCard from "./TaskCard";
import { useTaskContext } from "@/contexts/TaskContext";
import { Role } from "@/lib/types";

interface TaskListProps {
  className?: string;
}

const TaskList: React.FC<TaskListProps> = ({ className = "" }) => {
  const { filteredTasks } = useTaskContext();

  if (filteredTasks.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <p className="text-center text-gray-500">No tasks found for the selected role.</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${className} grid-cols-1 md:grid-cols-2 lg:grid-cols-3`}>
      {filteredTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
