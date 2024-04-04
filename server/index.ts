import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const fs = require("fs");
const httpServer = require("https").createServer(
  {
    key: fs.readFileSync("./privatekey.pem"),
    cert: fs.readFileSync("./cert.pem"),
  },
  app
);

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

app.get("/", (req, res) => res.send("Hello World!"));

io.on("connection", (socket) => {
  console.log("connected");
  socket.on("message", (event) => {
    io.emit("serverMessage", event);
  });
});

httpServer.listen(8080, () => {
  console.log("Chat server listening on port 8080");
});
