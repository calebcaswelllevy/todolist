"use strict";
exports.__esModule = true;
exports.Chore = void 0;
var Chore = /** @class */ (function () {
    function Chore(name, desc, status, priority, date) {
        if (status === void 0) { status = false; }
        if (priority === void 0) { priority = 0; }
        if (date === void 0) { date = null; }
        this.name = name;
        this.status = status;
        this.priority = priority;
        this.dueDate = date;
        this.description = desc;
    }
    //setters:
    Chore.prototype.setName = function (name) {
        this.name = name;
    };
    Chore.prototype.setStatus = function (status) {
        this.status = status;
    };
    Chore.prototype.setPriority = function (priority) {
        this.priority = priority;
    };
    Chore.prototype.setDueDate = function (date) {
        this.dueDate = date;
    };
    Chore.prototype.setDescription = function (desc) {
        this.description = desc;
    };
    //Getters:
    Chore.prototype.getName = function () {
        return this.name;
    };
    Chore.prototype.getStatus = function () {
        return this.status;
    };
    Chore.prototype.getPriority = function () {
        return this.priority;
    };
    Chore.prototype.getDueDate = function () {
        return this.dueDate;
    };
    Chore.prototype.getDescription = function () {
        return this.description;
    };
    return Chore;
}());
exports.Chore = Chore;
