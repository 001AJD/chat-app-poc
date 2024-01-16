import { WebSocketServer } from "ws";
import { registerSocketEventHandlers } from "./websockets/socket.js";

const wss = new WebSocketServer({ port: 8080 });
registerSocketEventHandlers(wss);
