"use strict";
exports.__esModule = true;
exports.domManager = void 0;
var chore_1 = require("./chore");
var list_1 = require("./list");
var taskmanager_1 = require("./taskmanager");
var $ = require("jquery");
$(function () {
    //Global drag event handlers:
    function allowDrop(ev) {
        ev.preventDefault();
    }
    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }
    function drop(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
    }
    //initialize the display
    exports.domManager.displayTitle();
    //make a stand in list:
    var todaysDate = new Date();
    var tomorrowsDate = new Date();
    tomorrowsDate.setDate(todaysDate.getDate() + 1);
    var list1 = new list_1.List([], "", "Test List");
    var chore1 = new chore_1.Chore("c1", false, 5, todaysDate, "Something to do");
    var chore2 = new chore_1.Chore("c2", false, 2, todaysDate, "Something to do");
    var chore3 = new chore_1.Chore("another", true, 1, tomorrowsDate, "Thing to do");
    taskmanager_1.notebook.addList(list1);
    list1.addChore(chore1);
    list1.addChore(chore2);
    list1.addChore(chore3);
    exports.domManager.renderList(list1, "active-list");
});
exports.domManager = (function () {
    //function to render a chore
    var renderChore = function (chore, location) {
        $("#" + location).append("<div id=\"" + chore.getName() + "\" draggable=\"true\" ondrag=\"drag(event)\" ></div>");
        $("#" + chore.getName()).addClass("container").append("<div class = \"chore-title\">" + chore.getName() + "</div>");
        $("#" + chore.getName()).append("<div>" + chore.getDescription() + "</div>");
        $("#" + chore.getName()).append("<div>" + chore.getDueDate() + "</div>");
        $("#" + chore.getName()).append("<input id=\"check-" + chore.getName() + "\" type=\"checkbox\">");
        addClickHandler("#check-" + chore.getName(), chore);
        return;
    };
    var addClickHandler = function (element, chore) {
        $(element).on("click", function () {
            //TODO: make this remove this chore from the DOM
            //make it remove from the list also
            if (chore.getStatus() === false) {
                chore.setStatus(true);
                $(element).parent().css("text-decoration", "line-through");
            }
            else {
                chore.setStatus(false);
                $(element).parent().css("text-decoration", "none");
            }
        });
    };
    //function to render active list
    var renderList = function (list, location) {
        var sortedList = list.getSortedChores();
        var days = ["Today", "Tomorrow", "Later"];
        for (var i = 0; i < days.length; i++) {
            $("#" + location).append("<div id='" + days[i] + "' ondrop=\"drop(event)\" ondragover=\"allowDrop(event)\">" + days[i] + "</div>");
        }
        for (var i = 0; i < sortedList.length; i++) {
            var today = taskmanager_1.TaskManager.isToday(sortedList[i].getDueDate());
            var tomorrow = taskmanager_1.TaskManager.isTomorrow(sortedList[i].getDueDate());
            switch (true) {
                case today: //Today's Date
                    exports.domManager.renderChore(sortedList[i], "Today");
                    break;
                case tomorrow: //Tomorrow's Date
                    exports.domManager.renderChore(sortedList[i], "Tomorrow");
                    break;
                case true: //after tomorrow
                    exports.domManager.renderChore(sortedList[i], 'Later');
                    break;
            }
        }
        return;
    };
    //function to start a new list
    var startNewList = function () {
        return;
    };
    //function to clear list display
    var clearList = function () {
        return;
    };
    var displayTitle = function () {
        $('#header').html("<h1>" + taskmanager_1.notebook.owner + "'s To Do List</h1>");
    };
    //function to style active chore
    //function to remove checked chore
    return {
        renderChore: renderChore,
        renderList: renderList,
        startNewList: startNewList,
        clearList: clearList,
        displayTitle: displayTitle
    };
})();
