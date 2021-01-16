"use strict";
exports.__esModule = true;
exports.List = void 0;
var List = /** @class */ (function () {
    function List(title, status, chores) {
        if (chores === void 0) { chores = []; }
        this.chores = chores;
        this.status = status;
        this.title = title;
        this;
    }
    //Setters:
    List.prototype.setChores = function (chores) {
        this.chores = chores;
    };
    List.prototype.setStatus = function (status) {
        this.status = status;
    };
    List.prototype.setTitle = function (title) {
        this.title = title;
    };
    //Getters:
    List.prototype.getChores = function () {
        return this.chores.slice();
    };
    List.prototype.getStatus = function () {
        return this.status;
    };
    List.prototype.getTitle = function () {
        return this.title;
    };
    //Other methods:
    List.prototype.addChore = function (chore) {
        this.chores.push(chore);
    };
    List.prototype.deleteChore = function (chore) {
        var indexOfChore = this.chores.indexOf(chore);
        this.chores.splice(indexOfChore, 1);
    };
    List.prototype.getSortedChores = function () {
        var chores = this.getChores();
        chores.sort(function (a, b) { return a.getPriority() > b.getPriority() ? 1 : -1; });
        return chores;
    };
    return List;
}());
exports.List = List;
