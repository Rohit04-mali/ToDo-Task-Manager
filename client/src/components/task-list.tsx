import { useQuery } from "@tanstack/react-query";
import { TaskItem } from "./task-item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SelectTask } from "@db/schema";
import { FileText } from "lucide-react";

export function TaskList() {
  const { data: tasks, isLoading } = useQuery<SelectTask[]>({
    queryKey: ['/api/tasks']
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  const filterTasks = (priority: number | null, completed?: boolean) => {
    return tasks?.filter(task => {
      if (completed !== undefined) {
        return task.completed === completed;
      }
      return !priority || task.priority === priority;
    }) || [];
  };

  const EmptyState = () => (
    <div className="text-center py-12">
      <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium text-foreground">No tasks found</h3>
      <p className="mt-2 text-sm text-muted-foreground">Get started by adding your first task</p>
    </div>
  );

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="low">Low</TabsTrigger>
        <TabsTrigger value="medium">Medium</TabsTrigger>
        <TabsTrigger value="high">High</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="mt-6">
        {filterTasks(null).length > 0 ? (
          <div className="space-y-4">
            {filterTasks(null).map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : <EmptyState />}
      </TabsContent>
      <TabsContent value="low" className="mt-6">
        {filterTasks(1).length > 0 ? (
          <div className="space-y-4">
            {filterTasks(1).map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : <EmptyState />}
      </TabsContent>
      <TabsContent value="medium" className="mt-6">
        {filterTasks(2).length > 0 ? (
          <div className="space-y-4">
            {filterTasks(2).map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : <EmptyState />}
      </TabsContent>
      <TabsContent value="high" className="mt-6">
        {filterTasks(3).length > 0 ? (
          <div className="space-y-4">
            {filterTasks(3).map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : <EmptyState />}
      </TabsContent>
      <TabsContent value="completed" className="mt-6">
        {filterTasks(null, true).length > 0 ? (
          <div className="space-y-4">
            {filterTasks(null, true).map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : <EmptyState />}
      </TabsContent>
    </Tabs>
  );
}