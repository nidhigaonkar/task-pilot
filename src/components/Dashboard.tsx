
import React from "react";
import { Button } from "@/components/ui/button";
import { useTaskContext } from "@/contexts/TaskContext";
import TaskList from "./TaskList";
import TaskFilter from "./TaskFilter";
import AddTaskButton from "./AddTaskButton";
import EmailReminderInfo from "./EmailReminderInfo";

const Dashboard: React.FC = () => {
  const { logout, accessLevel } = useTaskContext();
  const isAdmin = accessLevel === "admin";

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-primary mb-4 md:mb-0">IntelliHer Task Manager</h1>
        <div className="flex gap-4 w-full md:w-auto">
          <AddTaskButton />
          <Button variant="outline" onClick={logout}>
            Log Out
          </Button>
        </div>
      </div>
      
      {isAdmin && <EmailReminderInfo />}
      
      <TaskFilter />
      
      <TaskList className="pb-8" />
    </div>
  );
};

export default Dashboard;
