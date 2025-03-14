import { Server } from "socket.io";
import http from "http";

export const setupWebSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
	// This is built so iot devices can use a qr code to connect, I'm not quite sure the flow here
	// TODO: figure out the above
    console.log("🔌 New WebSocket connection:", socket.id);

    socket.on("watch-session", (sessionToken) => {
      console.log(`👀 Watching session: ${sessionToken}`);
      socket.join(sessionToken);
    });

    socket.on("disconnect", () => {
      console.log("❌ WebSocket disconnected:", socket.id);
    });
  });

  return io;
};

export const notifyAuthentication = (io: Server, sessionToken: string) => {
  io.to(sessionToken).emit("authenticated");
};