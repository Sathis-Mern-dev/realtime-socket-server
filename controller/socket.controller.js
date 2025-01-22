export const handleWebSocketConnection = (ws, wss) => {
    console.log('New client connected');
    
    // Notify others of a new connection
    broadcast(wss, { type: 'user-connect', message: 'A user joined' });
  
    ws.on('message', (message) => {
      const data = JSON.parse(message);
      switch (data.type) {
        case 'draw-event':
          broadcast(wss, data, ws); // Broadcast drawing data
          break;
        case 'reset-canvas':
          broadcast(wss, { type: 'reset-canvas' }); // Notify all clients to reset
          break;
      }
    });
  
    ws.on('close', () => {
      console.log('Client disconnected');
      broadcast(wss, { type: 'user-disconnect', message: 'A user left' });
    });
  };
  
  // Helper to broadcast messages
  const broadcast = (wss, data, sender = null) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client !== sender) {
        client.send(JSON.stringify(data));
      }
    });
  };
  