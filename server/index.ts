import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const cors = require("cors");
app.use(cors());

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
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

httpServer.listen(8080, () => {
  console.log("Chat server listening on port 8080");
});
