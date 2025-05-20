
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Bell } from "lucide-react";

const EmailReminderInfo: React.FC = () => {
  return (
    <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Mail className="h-5 w-5" /> IntelliHer Admin Dashboard
        </CardTitle>
        <CardDescription>
          You have admin access to manage tasks and reminders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Bell className="h-4 w-4 text-purple-700" />
            <p className="text-sm text-purple-900">Reminder system:</p>
            <Badge variant="secondary" className="bg-purple-200 text-purple-800">
              Custom reminders per task
            </Badge>
            <Badge variant="secondary" className="bg-purple-200 text-purple-800">
              Email notifications
            </Badge>
          </div>
          <p className="text-sm text-purple-600 italic">
            Email integration will be connected to your account for automated reminders.
            Tasks can have individual reminder schedules that you set.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailReminderInfo;
