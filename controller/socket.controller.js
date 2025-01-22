import { WebSocket } from "ws";

export const handleWebSocketConnection = (ws, wss) => {
  console.log("New client connected");

  // Notify others of a new connection
  broadcast(wss, { type: "user-connect", message: "A user joined" });

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      switch (data.type) {
        case "draw-event":
          // Broadcast drawing data to all clients except sender
          broadcast(wss, data, ws);
          break;
        case "reset-canvas":
          // Broadcast reset event to all clients
          broadcast(wss, { type: "reset-canvas" });
          break;
        default:
          console.error("Unknown event type:", data.type);
      }
    } catch (error) {
      console.error("Invalid message received:", message);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    broadcast(wss, { type: "user-disconnect", message: "A user left" });
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
};

// Helper to broadcast messages to all clients
const broadcast = (wss, data, sender = null) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client !== sender) {
      client.send(JSON.stringify(data));
    }
  });
};
