'use strict';

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
const cors = require("cors");
const { createServer } = require("http")
const jwt = require("jsonwebtoken");

const { Server } = require("socket.io");

const authRouter = require('../../interfaces/routes/auth.route');
const socketRouter = require('../../interfaces/routes/socket.route');


var app = express();


app.use(logger("dev"));
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.get('*', function (req, res) {
  res.status(404).json({
    message: "Page not found"
  });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    // methods: ["GET", "POST"],
    allowedHeaders: ["x-access-token"],
    credentials: true
  }
})

io.use((socket, next) => {
  const token = socket.handshake.headers["x-access-token"];
  if (!token) {
    next(new Error('Authentication error'));
  }
  jwt.verify(token, process.env.SECRECT, (error, data) => {
    if (error) return next(new Error('Authentication error'));
    socket.userId = data.id;
    next();
  });
  next()
})

io.on("connection", async (socket) => {
  console.log("Connected");

  // console.log(socket.userId)
  socket.on(process.env.HELLO, (arg) => {
    return socketRouter.hello(arg)
  });

  socket.emit(process.env.LIST_ROOMS, await socketRouter.listRooms())

  socket.on(process.env.JOIN_TO_ROOM, (roomId, cb) => {
    return socketRouter.joinToRoom(roomId, socket.userId).then((response) => {
      if(response.status) {
        socket.join(roomId);
      }
      cb(response);
    });
  })
})

module.exports = httpServer;