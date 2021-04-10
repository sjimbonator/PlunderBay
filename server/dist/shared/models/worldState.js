"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldState = void 0;
class WorldState {
    constructor(ships) {
        this.ships = ships;
    }
    static fromJSON(jsonString) {
        let json = JSON.parse(jsonString);
        return new WorldState(new Map(json["ships"]));
    }
    static empty() {
        return new WorldState(new Map());
    }
    toJSON() {
        let json = { ships: Array.from(this.ships.entries()) };
        return JSON.stringify(json);
    }
}
exports.WorldState = WorldState;
//# sourceMappingURL=worldState.js.map