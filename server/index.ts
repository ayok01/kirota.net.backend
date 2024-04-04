import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { path: "/socket/" });
const cors = require("cors");
app.use(cors());

app.get("/", (req: express.Request, res: express.Response) => {
  res.json({
    message: "root path",
  });
});

io.on("connection", (socket) => {
  console.log("connected");
});

httpServer.listen(8080, () => {
  console.log("Chat server listening on port 8080");
});
