
import React from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ROLES } from "@/lib/mock-data";

const TaskFilter: React.FC = () => {
  const { selectedRole, setSelectedRole, showCompletedTasks, setShowCompletedTasks } = useTaskContext();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6">
      <div className="w-full md:w-auto">
        <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as any)}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1).replace("-", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="show-completed"
          checked={showCompletedTasks}
          onCheckedChange={setShowCompletedTasks}
        />
        <Label htmlFor="show-completed">Show completed tasks</Label>
      </div>
    </div>
  );
};

export default TaskFilter;
