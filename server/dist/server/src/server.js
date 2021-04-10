"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const uuid_1 = require("uuid");
const gameRoom_1 = require("./gameRoom");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
app.set("port", process.env.PORT || 3000);
const ticks = 20; //Ticks per second
const msPerTick = 1000 / ticks;
let tickNr = 1;
app.get("/", (req, res) => {
    res.sendFile(path.resolve("./client/index.html"));
});
app.get("/main.js", (req, res) => {
    res.sendFile(path.resolve("./client/dist/main.js"));
});
app.get("/test.gltf", (req, res) => {
    res.sendFile(path.resolve("./client/dist/test.gltf"));
});
let gameroom = new gameRoom_1.GameRoom("game1");
io.on("connection", function (socket) {
    //Generate userId, add player to our gameroom, inform player of their ID.
    let playerId = uuid_1.v4();
    gameroom.spawnShip(playerId, socket);
    socket.join(gameroom.getName());
    socket.emit('playerIdSet', playerId);
    // Informing parties of new player
    socket.to(gameroom.getName()).emit('social', "A player joined the server");
    console.log("a user connected");
    socket.on('clientUpdate', function (data) {
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
const server = http.listen(3000, function () {
    console.log("listening on *:3000");
});
//# sourceMappingURL=server.js.map