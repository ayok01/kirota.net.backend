import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const https = require("https");
const app = express();
const fs = require("fs");
const cors = require("cors");
const path = require("path");

// SSL証明書の読み込み
// const options = {
//   key: fs.readFileSync("./privatekey.pem"),
//   cert: fs.readFileSync("./cert.pem"),
// };
// 資格情報オブジェクトを作成する
// const credentials = { key: options.key, cert: options.cert };

// HTTP-01 challengeへのルートを追加
app.use(
  "/.well-known/acme-challenge",
  express.static(path.join(__dirname, ".well-known", "acme-challenge"))
);

const port = "80";

// const httpsServer = https.createServer(credentials, app);
const httpServer = createServer(app);
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

httpServer.listen(port, () => {
  console.log("Chat server listening on port" + port);
});

// httpsServer.listen(443, () => {
//   console.log("Chat server listening on port 443");
// });
