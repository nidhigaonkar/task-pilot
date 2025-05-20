
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
    <div className="flex h-screen items-center justify-center bg-blue-50">
      <Card className="w-[350px] shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Club Task Manager</CardTitle>
          <CardDescription>Enter the club password to continue</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Enter club password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Access Dashboard
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AuthScreen;
