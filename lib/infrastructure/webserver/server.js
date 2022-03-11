'use strict';

var express = require("express");
var logger = require("morgan");
const cors = require("cors");
const { createServer } = require("http")
const jwt = require("jsonwebtoken");

const { Server } = require("socket.io");

const authRouter = require('../../interfaces/routes/auth.route');
const socketRouter = require('../../interfaces/routes/socket.route');
const roomRouter = require('../../interfaces/routes/room.route');


var app = express();


app.use(logger("dev"));
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use('/rooms', roomRouter);
app.get('*', function (req, res) {
  res.status(404).json({
    message: "Page not found"
  });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_HTTP_ENTRY_POINT,
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
      if (response.status) {
        socket.join(roomId);
        socket.to(roomId).emit("new_user_join", { some: "a new user has joined the room" });
      }
      cb(response);
    });
  })

  socket.on(process.env.LEAVE_ROOM, (roomId, cb) => {
    return socketRouter.leaveRoom(roomId, socket.userId).then(async (response) => {
      if (response.status) {
        socket.leave(roomId);
        socket.to(roomId).emit("new_user_join", { some: `user ${socket.id} has left the room` });
      }
      socket.emit(process.env.LIST_ROOMS, await socketRouter.listRooms())
      cb(response);
    })
  })

  socket.on(process.env.GET_ROOM, (roomId, cb) => {

    // let roster = io.sockets.adapter.rooms;
    // console.log(roomId)
    // console.log(roster)
    // console.log(roster.get(roomId))
    // cb(roster);

    return socketRouter.getRoom(roomId).then((response) => {
      cb(response);
    })
  })

  // socket.emit(process.env.GET_ROOM, await socketRouter.getRoomFromUserId(socket.userId));

  // bat dau
  socket.on(process.env.START_GAME, (roomId, coin, cb) => {
    return socketRouter.startGame(roomId, coin).then((response) => {
      cb(response);
    })
  })

  // rut bai
  socket.on(process.env.DRAW_CARDS, (matchId, cb) => {
    return socketRouter.drawCards(matchId, socket.userId).then((response) => {
      cb(response);
    })
  })

  //giang => nguoi tiep theo
  socket.on(process.env.NEXT_USER_DRAW_CARDS, (matchId, cb) => {
    return socketRouter.getUserDrawCards(matchId, socket.userId).then((response) => {
      cb(response);
    })
  })

  // khui bai 1 nguoi

  socket.on(process.env.SHOW_CARDS_OF_USER, (matchId, userId, cb) => {
    return socketRouter.showCardOfUser(matchId, userId, socket.userId).then((response) => {
      cb(response);
    })
  })

  // ket thuc van bai
  socket.on(process.env.FINISH_MATCH, (matchId, roomId, cb) => {
    return socketRouter.finishMatch(matchId, roomId).then((response) => {
      cb(response);
    })
  })

})

module.exports = httpServer;