import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Zap, Filter, Download, BarChart3 } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SelectTask } from "@db/schema";
import { useToast } from "@/hooks/use-toast";

export function QuickActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: tasks = [] } = useQuery<SelectTask[]>({
    queryKey: ['/api/tasks']
  });

  const markAllCompletedMutation = useMutation({
    mutationFn: async () => {
      const incompleteTasks = tasks.filter(task => !task.completed);
      await Promise.all(
        incompleteTasks.map(task =>
          apiRequest("PATCH", `/api/tasks/${task.id}`, { completed: true })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: "Success!",
        description: "All tasks marked as completed",
      });
    }
  });

  const clearCompletedMutation = useMutation({
    mutationFn: async () => {
      const completedTasks = tasks.filter(task => task.completed);
      await Promise.all(
        completedTasks.map(task =>
          apiRequest("DELETE", `/api/tasks/${task.id}`)
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: "Cleaned up!",
        description: "All completed tasks removed",
      });
    }
  });

  const exportTasks = () => {
    const exportData = tasks.map(task => ({
      title: task.title,
      description: task.description,
      priority: task.priority === 1 ? 'Low' : task.priority === 2 ? 'Medium' : 'High',
      completed: task.completed ? 'Yes' : 'No',
      createdAt: new Date(task.createdAt).toLocaleDateString()
    }));

    const csvContent = [
      ['Title', 'Description', 'Priority', 'Completed', 'Created'],
      ...exportData.map(task => [
        task.title,
        task.description || '',
        task.priority,
        task.completed,
        task.createdAt
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Exported!",
      description: "Tasks exported to CSV file",
    });
  };

  const incompleteTasks = tasks.filter(task => !task.completed).length;
  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Zap className="h-4 w-4" />
          <span className="hidden sm:inline">Quick Actions</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center space-x-2">
          <BarChart3 className="h-4 w-4" />
          <span>Productivity Tools</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={() => markAllCompletedMutation.mutate()}
          disabled={incompleteTasks === 0 || markAllCompletedMutation.isPending}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Complete All Tasks ({incompleteTasks})</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => clearCompletedMutation.mutate()}
          disabled={completedTasks === 0 || clearCompletedMutation.isPending}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Clear Completed ({completedTasks})</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={exportTasks}
          disabled={tasks.length === 0}
          className="flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export Tasks</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}