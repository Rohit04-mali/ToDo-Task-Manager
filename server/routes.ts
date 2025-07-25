import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { db } from "@db";
import { tasks } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // WebSocket connections store
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    
    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  // Broadcast high priority notifications
  const broadcastNotification = (task: any) => {
    const message = JSON.stringify({
      type: 'notification',
      task
    });

    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // Tasks API routes
  app.get("/api/tasks", async (req, res) => {
    const allTasks = await db.select().from(tasks);
    res.json(allTasks);
  });

  app.post("/api/tasks", async (req, res) => {
    const task = await db.insert(tasks).values(req.body).returning();
    if (req.body.priority === 3) {
      broadcastNotification(task[0]);
    }
    res.json(task[0]);
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    const task = await db
      .update(tasks)
      .set(req.body)
      .where(eq(tasks.id, parseInt(req.params.id)))
      .returning();
    res.json(task[0]);
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    await db.delete(tasks).where(eq(tasks.id, parseInt(req.params.id)));
    res.json({ success: true });
  });

  return httpServer;
}
