import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const socketIO = require("socket.io");
const app = express();
const cors = require("cors");

const port = "8080";

const httpServer = createServer(app);
app.use(cors());

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.get("/", (req: express.Request, res: express.Response) => {
  res.json({
    message: "root path",
  });
});

io.on("connection", (socket) => {
  console.log("connected");
  socket.on("message", (event) => {
    io.emit("serverMessage", event);
  });
});

httpServer.listen(port, () => {
  console.log("Chat server listening on port" + port);
});
