import { SelectTask } from "@db/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar, Clock, MoreHorizontal, Trash2, Edit3, AlertTriangle, Circle, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TaskItemProps {
  task: SelectTask;
}

const priorityConfig = {
  1: { 
    label: "Low", 
    color: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400", 
    icon: Circle,
    gradientFrom: "from-blue-500/10",
    gradientTo: "to-blue-600/5"
  },
  2: { 
    label: "Medium", 
    color: "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400", 
    icon: Star,
    gradientFrom: "from-yellow-500/10",
    gradientTo: "to-yellow-600/5"
  },
  3: { 
    label: "High", 
    color: "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/30 dark:text-red-400", 
    icon: AlertTriangle,
    gradientFrom: "from-red-500/10",
    gradientTo: "to-red-600/5"
  }
};

export function TaskItem({ task }: TaskItemProps) {
  const queryClient = useQueryClient();
  const priority = priorityConfig[task.priority as keyof typeof priorityConfig];
  const PriorityIcon = priority.icon;

  const toggleComplete = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", `/api/tasks/${task.id}`, {
        completed: !task.completed
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    }
  });

  const deleteTask = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/tasks/${task.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    }
  });

  const timeAgo = formatDistanceToNow(new Date(task.createdAt), { addSuffix: true });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.01 }}
      className="group"
    >
      <Card className={cn(
        "border-0 shadow-sm hover:shadow-md transition-all duration-200",
        "bg-gradient-to-r", priority.gradientFrom, priority.gradientTo,
        task.completed && "opacity-60"
      )}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Checkbox */}
            <div className="flex items-center justify-center mt-1">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleComplete.mutate()}
                disabled={toggleComplete.isPending}
                className="h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className={cn(
                  "font-semibold text-lg leading-tight",
                  task.completed 
                    ? "line-through text-muted-foreground" 
                    : "text-foreground"
                )}>
                  {task.title}
                </h3>
                
                {/* Priority Badge */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Badge variant="outline" className={cn("flex items-center space-x-1", priority.color)}>
                    <PriorityIcon className="h-3 w-3" />
                    <span className="text-xs font-medium">{priority.label}</span>
                  </Badge>
                </div>
              </div>

              {/* Description */}
              {task.description && (
                <p className={cn(
                  "text-sm mb-3 leading-relaxed",
                  task.completed 
                    ? "text-muted-foreground line-through" 
                    : "text-muted-foreground"
                )}>
                  {task.description}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Created {timeAgo}</span>
                  </div>
                  {task.completed && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Completed</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="flex items-center space-x-2">
                      <Edit3 className="h-4 w-4" />
                      <span>Edit Task</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center space-x-2 text-destructive focus:text-destructive"
                      onClick={() => deleteTask.mutate()}
                      disabled={deleteTask.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Task</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
