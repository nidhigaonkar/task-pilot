import React from "react";
import { TaskProvider, useTaskContext } from "@/contexts/TaskContext";
import AuthScreen from "@/components/AuthScreen";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  return (
    <TaskProvider>
      <IndexContentWrapper />
    </TaskProvider>
  );
};

// Separate component to use the context after provider is mounted
const IndexContentWrapper = () => {
  const { isAuthenticated } = useTaskContext();
  return isAuthenticated ? <Dashboard /> : <AuthScreen />;
};

export default Index;
