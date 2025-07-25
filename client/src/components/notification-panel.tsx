import { useEffect, useState } from "react";
import { addNotificationListener, connectWebSocket } from "@/lib/websocket";
import { SelectTask } from "@db/schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, X, AlertTriangle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationPanel() {
  const [notifications, setNotifications] = useState<SelectTask[]>([]);

  useEffect(() => {
    connectWebSocket();
    
    const removeListener = addNotificationListener((data) => {
      if (data.type === 'notification') {
        setNotifications(prev => [data.task, ...prev].slice(0, 3));
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
          setNotifications(current => current.filter(n => n.id !== data.task.id));
        }, 8000);
      }
    });

    return removeListener;
  }, []);

  const removeNotification = (taskId: number) => {
    setNotifications(prev => prev.filter(n => n.id !== taskId));
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 space-y-3 z-50">
      <AnimatePresence>
        {notifications.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 25,
              duration: 0.3 
            }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 shadow-lg backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30">
                      <Zap className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <h4 className="font-semibold text-sm text-red-800 dark:text-red-200">
                          High Priority Task Added!
                        </h4>
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">
                          {task.description.length > 60 
                            ? `${task.description.substring(0, 60)}...` 
                            : task.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-red-600/60 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                    onClick={() => removeNotification(task.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}