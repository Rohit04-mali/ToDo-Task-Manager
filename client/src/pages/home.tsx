import { CreateTask } from "@/components/create-task";
import { TaskList } from "@/components/task-list";
import { NotificationPanel } from "@/components/notification-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { TaskStats } from "@/components/task-stats";
import { QuickActions } from "@/components/quick-actions";
import { CheckCircle2, Target, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Enhanced Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                TaskFlow Pro
              </h1>
              <p className="text-xs text-muted-foreground">Smart Task Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <QuickActions />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Stay Focused, Get Things Done
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Organize your tasks intelligently with priority management and real-time insights
            </p>
          </div>
          
          {/* Task Stats */}
          <TaskStats />
        </section>

        {/* Task Management Section */}
        <section className="py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold">Your Tasks</h3>
                <p className="text-sm text-muted-foreground">Manage and track your progress</p>
              </div>
            </div>
            <CreateTask />
          </div>
          
          <TaskList />
        </section>
      </main>

      <NotificationPanel />
    </div>
  );
}