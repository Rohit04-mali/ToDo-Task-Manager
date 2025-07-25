let ws: WebSocket | null = null;
let reconnectInterval: NodeJS.Timeout | null = null;
const listeners: ((data: any) => void)[] = [];

export function connectWebSocket() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    return;
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  const wsUrl = `${protocol}//${host}/ws`;

  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log('WebSocket connected');
    if (reconnectInterval) {
      clearInterval(reconnectInterval);
      reconnectInterval = null;
    }
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      listeners.forEach(listener => listener(data));
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
    ws = null;
    
    // Reconnect after 5 seconds
    if (!reconnectInterval) {
      reconnectInterval = setTimeout(() => {
        connectWebSocket();
      }, 5000);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
}

export function addNotificationListener(callback: (data: any) => void) {
  listeners.push(callback);
  
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}