"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoom = void 0;
const worldState_1 = require("../../shared/models/worldState");
const shiptypes = require("./shiptypes");
class GameRoom {
    constructor(name) {
        this.name = name;
        this.world = worldState_1.WorldState.empty();
        this.idToSocket = new Map();
    }
    getName() {
        return this.name;
    }
    removePlayer(playerID) {
        this.world.ships.delete(playerID);
    }
    spawnShip(playerID, socket) {
        this.idToSocket.set(playerID, socket);
        let playerShip = shiptypes.getSloop();
        //ToDo: add random spawn location
        this.world.ships.set(playerID, playerShip);
    }
    removeShip(playerId) {
        this.world.ships.delete(playerId);
        this.idToSocket.delete(playerId);
    }
    applyClientUpdate(update) {
        if (this.world.ships.has(update.id)) {
            let ship = this.world.ships.get(update.id);
            ship.lastProcessedInput = update.requestNr;
            //ToDo: validate input
            ship.x += update.input.xMovement;
            ship.z += update.input.zMovement;
            ship.currentRotation += update.input.rotationMovement;
            const maxRadial = Math.PI * 2;
            if (ship.currentRotation > maxRadial) {
                ship.currentRotation = 0;
            }
            if (ship.currentRotation < 0) {
                ship.currentRotation = maxRadial;
            }
            this.world.ships.set(update.id, ship);
        }
    }
    getWorldUpdateJSON() {
        return this.world.toJSON();
    }
}
exports.GameRoom = GameRoom;
//# sourceMappingURL=gameRoom.js.map