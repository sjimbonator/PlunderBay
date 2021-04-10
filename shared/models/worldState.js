var WorldState = /** @class */ (function () {
    function WorldState(ships) {
        this.ships = ships;
    }
    WorldState.fromJSON = function (jsonString) {
        var json = JSON.parse(jsonString);
        return new WorldState(new Map(json["ships"]));
    };
    WorldState.empty = function () {
        return new WorldState(new Map());
    };
    WorldState.prototype.toJSON = function () {
        var json = { ships: Array.from(this.ships.entries()) };
        return JSON.stringify(json);
    };
    return WorldState;
}());
export { WorldState };
