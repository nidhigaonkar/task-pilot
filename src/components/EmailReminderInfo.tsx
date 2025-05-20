
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { REMINDER_SETTINGS } from "@/lib/mock-data";
import { Mail, Clock } from "lucide-react";

const EmailReminderInfo: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" /> Email Reminder System
        </CardTitle>
        <CardDescription>
          Automated reminders will be sent to team members based on these settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm">Reminder schedule:</p>
            <div className="flex gap-2">
              {REMINDER_SETTINGS.daysBeforeDue.map((days) => (
                <Badge key={days} variant="outline">
                  {days} day{days !== 1 ? "s" : ""} before due date
                </Badge>
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground italic">
            Note: Email integration will be available in the next version. 
            For now, this is just a mockup of how the system will work.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailReminderInfo;
