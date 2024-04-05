import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const https = require("https");
const app = express();
const fs = require("fs");
const cors = require("cors");

// SSL証明書の読み込み
const options = {
  key: fs.readFileSync("path/to/private.key"), // 秘密鍵のパス
  cert: fs.readFileSync("path/to/certificate.crt"), // 証明書のパス
};
// 資格情報オブジェクトを作成する
const credentials = { key: options.key, cert: options.cert };

const httpServer = https.createServer(app);
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

httpServer.listen(80, () => {
  console.log("Chat server listening on port 80");
});

httpServer.listen(443, () => {
  console.log("Chat server listening on port 443");
});
