
import { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const AuthScreen = () => {
  const [password, setPassword] = useState("");
  const { authenticate } = useTaskContext();
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === "") {
      setError("Password cannot be empty");
      return;
    }
    
    const success = authenticate(password);
    if (!success) {
      setError("Incorrect password");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <Card className="w-[350px] shadow-lg border-purple-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-purple-800">IntelliHer Task Manager</CardTitle>
          <CardDescription>Enter your access password to continue</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="text-xs text-gray-500">
                <p>• Use member password for team access</p>
                <p>• Use admin password for full admin access</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              Access Dashboard
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AuthScreen;
