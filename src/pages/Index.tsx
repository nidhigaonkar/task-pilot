
import { TaskProvider } from "@/contexts/TaskContext";
import { useTaskContext } from "@/contexts/TaskContext";
import AuthScreen from "@/components/AuthScreen";
import Dashboard from "@/components/Dashboard";

const IndexContent = () => {
  const { isAuthenticated } = useTaskContext();
  return isAuthenticated ? <Dashboard /> : <AuthScreen />;
};

const Index = () => {
  return (
    <TaskProvider>
      <IndexContent />
    </TaskProvider>
  );
};

export default Index;
