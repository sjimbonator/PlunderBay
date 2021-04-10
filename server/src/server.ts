import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

import { GameRoom } from './gameRoom'

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.set("port", process.env.PORT || 3000);
const ticks: number = 20; //Ticks per second

const msPerTick: number = 1000 / ticks;
let tickNr: number = 1;

app.get("/", (req: any, res: any) => {
  res.sendFile(path.resolve("./client/index.html"));
});

app.get("/main.js", (req: any, res: any) => {
  res.sendFile(path.resolve("./client/dist/main.js"));
});

app.get("/test.gltf", (req: any, res: any) => {
  res.sendFile(path.resolve("./client/dist/test.gltf"));
});

let gameroom: GameRoom = new GameRoom("game1");

io.on("connection", function (socket: any) {
  //Generate userId, add player to our gameroom, inform player of their ID.
  let playerId = uuidv4();
  gameroom.spawnShip(playerId, socket)
  socket.join(gameroom.getName());
  socket.emit('playerIdSet', playerId);

  // Informing parties of new player
  socket.to(gameroom.getName()).emit('social', "A player joined the server");
  console.log("a user connected");
  socket.on('clientUpdate', function (data: string) {
    gameroom.applyClientUpdate(JSON.parse(data));
  });

  socket.once('disconnect', () => {
    console.log("a user disconnected");
    io.to(gameroom.getName()).emit('playerDisconnected', playerId);
    gameroom.removePlayer(playerId);
  });

});

//Update loop
setInterval(() => {
  // Inform all players in the game room of all players
  io.to(gameroom.getName()).emit('worldStateUpdate', gameroom.getWorldUpdateJSON());
  tickNr++;
}, msPerTick);

const server = http.listen(process.env.PORT || 3000, function () {
  console.log("listening on *:" + process.env.PORT);
});