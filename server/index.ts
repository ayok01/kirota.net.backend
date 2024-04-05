import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const https = require("https");
const app = express();
const fs = require("fs");
const cors = require("cors");
const path = require("path");

// letsencrypt-express用の初期化コード開始

// 次の行の.testing()は本番環境では外して下さい
var LEX = require("letsencrypt-express");
// 以下の2行は環境に合わせて変更して下さい！
var DOMAIN = "back.test.kirota.net";
var EMAIL = "user@example.com";

var lex = LEX.create({
  configDir: require("os").homedir() + "/letsencrypt/etc",
  approveRegistration: function (hostname, approve) {
    // leave `null` to disable automatic registration
    if (hostname === DOMAIN) {
      // Or check a database or list of allowed domains
      approve(null, {
        domains: [DOMAIN],
        email: EMAIL,
        agreeTos: true,
      });
    }
  },
});

// SSL証明書の読み込み
// const options = {
//   key: fs.readFileSync("./privatekey.pem"),
//   cert: fs.readFileSync("./cert.pem"),
// };
// 資格情報オブジェクトを作成する
// const credentials = { key: options.key, cert: options.cert };

const port = "80";

// const httpsServer = https.createServer(credentials, app);
const httpServer = createServer(app);
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

// ここからlets用の実行部コード
lex.onRequest = app;

lex.listen([80], [443, 5001], function () {
  var protocol = "requestCert" in this ? "https" : "http";
  console.log(
    "Listening at " + protocol + "://localhost:" + this.address().port
  );
});

httpServer.listen(port, () => {
  console.log("Chat server listening on port" + port);
});

// httpsServer.listen(443, () => {
//   console.log("Chat server listening on port 443");
// });
