"use strict";
exports.__esModule = true;
exports.domManager = void 0;
var chore_1 = require("./chore");
var list_1 = require("./list");
var taskmanager_1 = require("./taskmanager");
var $ = require("jquery");
$(function () {
    //initialize the display
    exports.domManager.displayTitle();
    exports.domManager.renderChorePage();
});
exports.domManager = (function () {
    //function to render a chore
    var renderChore = function (chore, location) {
        $("#" + location).append("<div id=\"" + chore.getName() + "\"></div>");
        //$(`#${chore.getName()}`).draggable();
        $("#" + chore.getName()).addClass("container chore");
        //.append(`<div class = "chore-title">${chore.getName()}</div>`)
        $("#" + chore.getName()).append("<div class=\"description\">" + chore.getDescription() + "</div>");
        $("#" + chore.getName()).append("<input id=\"check-" + chore.getName() + "\" type=\"checkbox\" class=\"checkbox\">");
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
            $("#" + location).append("<div id='" + days[i] + "' class=\"day\"><h2 class=\"day-name\">" + days[i] + "<h2></div>");
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
    var renderChorePage = function () {
        //make a stand in list:
        if (taskmanager_1.notebook.getLists().length == 0) {
            var todaysDate = new Date();
            var tomorrowsDate = new Date();
            tomorrowsDate.setDate(todaysDate.getDate() + 1);
            var list1 = new list_1.List("Test List");
            var chore1 = new chore_1.Chore("c1", false, 5, todaysDate, "Something to do");
            var chore2 = new chore_1.Chore("c2", false, 2, todaysDate, "Something to do");
            var chore3 = new chore_1.Chore("another", true, 1, tomorrowsDate, "Thing to do");
            taskmanager_1.notebook.addList(list1);
            list1.addChore(chore1);
            list1.addChore(chore2);
            list1.addChore(chore3);
            taskmanager_1.notebook.addList(new list_1.List("Stuff Madison wants me to do"));
        }
        $("#main-display").html("\n            <div id=\"active-list\" class=\"container list-holder\" >\n\n            </div>\n            <div id=\"bottom-menu\" class=\"container\">\n                <button id=\"list-manager\" class=\"btn\">Lists</button>\n                <button id=\"add\" class=\"btn btn-primary\">+</button>\n            </div>");
        exports.domManager.renderList(taskmanager_1.notebook.getLists()[0], "active-list");
        exports.domManager.renderSideBar();
        exports.domManager.handleNewList();
        exports.domManager.addListClick();
        $('#list-manager').on('click', exports.domManager.renderListPage);
    };
    //function to start a new list
    var handleNewList = function () {
        $('#add').on('click', renderAddChorePage);
    };
    //function to clear list display
    var clearList = function () {
        $('#active-list').html('');
        return;
    };
    var displayTitle = function () {
        $('#header').html("<h1>" + taskmanager_1.notebook.owner + "'s To Do List</h1>");
    };
    //function to render other lists
    var renderSideBar = function () {
        $('#side-nav').html('<h2 id="side-nav-title">Lists:</h2>');
        var lists = taskmanager_1.notebook.getLists();
        var n = lists.length;
        for (var i = 0; i < n; i++) {
            var title = lists[i].title;
            $('#side-nav').append("<li id=\"" + title + "\" class=\"nav-bar-list-element\">" + lists[i].getTitle() + "</li>");
        }
        addListButtons();
    };
    //listener for list click:
    //change list status to active
    //remove active status from other list
    //render new active list in main display
    var addListClick = function () {
        var getLists = function () {
            var lists = $('#side-nav').children('li');
            return lists;
        };
        var addHandleListClick = function (list) {
            var handleListClick = function () {
                var lists = taskmanager_1.notebook.getLists();
                var clicked;
                for (var i = 0; i < lists.length; i++) {
                    var title = lists[i].title;
                    if (title === list.textContent) {
                        clicked = lists[i];
                        break;
                    }
                }
                exports.domManager.clearList();
                exports.domManager.renderList(clicked, 'active-list');
                //remove formatting form other li:
                exports.domManager.formatInactive();
                //format active list to make it stand out
                exports.domManager.formatActive(list);
            };
            $(list).on('click', handleListClick);
            return;
        };
        var lists = getLists();
        for (var i = 0; i < lists.length; i++) {
            addHandleListClick(lists[i]);
        }
    };
    //Make active list stand out:
    var formatActive = function (list) {
        $(list).css('list-style-type', 'hebrew')
            .css("box-shadow", "2px, 2px, 2px, #f4decb")
            .css("font-size", "1.2rem")
            .css("font-weight", "bold");
    };
    //make inactive lists base formatting:
    var formatInactive = function () {
        console.log("runnig");
        $('#side-nav').children('li').css('list-style-type', 'kannada')
            .css("box-shadow", "")
            .css("font-size", "")
            .css("font-weight", "");
    };
    //Function to render lists page
    var renderListPage = function () {
        //Clear main display
        $('#main-display').html("\n        <div id=\"list-form\">\n        <h2 class=\"day-name\">Add a List</h2>\n            <form id=\"new-list-form\" autocomplete=\"off\">\n                <input id=\"new-form\" type=\"text\" placeholder=\"Enter a List Name\">\n                <input id=\"new-form-submit\" type = \"button\" class=\"btn\" value=\"Create List\">\n            </form>\n         <div id=\"bottom-menu\" class=\"container\">\n              <button id=\"list-manager\" class=\"btn bottom-main-button\">Chores</button>\n              <button id=\"add\" class=\"btn btn-primary\">+</button>\n         </div>\n        </div>");
        //put input form in main display
        $('#list-form').css('display', 'grid');
        //add buttons to lists:
        renderSideBar();
        //clear completed
        //delete list
        //Add listener button to get back to main page:
        $('#list-manager').on('click', renderChorePage);
        handleNewList();
        handleAddList();
    };
    //function to render add chore page
    var renderAddChorePage = function () {
        $('#main-display').html("\n        <h2 class=\"day-name\">New Chore</h2>\n        <form id=\"new-chore-form\" class=\"container\" autocomplete=\"off\">\n\n            <label for=\"description\">Description</label>\n            <input id=\"description\" type=\"text\" placeholder=\"Enter a FUN new chore!\" class=\"chore-input\"></input>\n            \n            <label for=\"priority\">Priority</label>\n            <input id=\"priority\" type=\"range\" min=\"0\" max=\"10\" default=1 step=1 class=\"chore-input\"></input>\n           \n            <label for=\"date\">Due Date</label>\n            <input id=\"date\" type=\"date\" class=\"chore-input\"></input>\n            \n            <button id=\"add-chore\" type=\"button\">Add Chore</button>\n        </form>\n        <div id=\"bottom-menu\" class=\"container\">\n            <button id=\"list-manager\" class=\"btn\">Chores</button>\n            \n        </div>\n        ");
        renderSideBar();
        addListClick();
        $('#list-manager').on('click', exports.domManager.renderChorePage);
        addChore();
    };
    //function to create new list from buttons
    var handleAddList = function () {
        var title = $('input').val().toString();
        var addList = function () {
            var newList = new list_1.List(title);
            taskmanager_1.notebook.addList(newList);
            renderListPage();
            addListButtons();
        };
        $('#new-form-submit').on('click', addList);
    };
    var addListButtons = function () {
        $('#side-nav').children('li').append('<button class="delete-list list-btn">X</button>');
        $('#side-nav').children('li').append('<button class="clean-list list-btn">Tidy</button>');
        tidy();
        handleDeleteList();
    };
    //Delete old lists:
    var handleDeleteList = function () {
        var deleteList = function (event) {
            var title = $(event.target)
                .parent('li')
                .clone() //clone parent node
                .children() //select children
                .remove() //remove children
                .end() //go back to parent
                .text(); //retrive text
            taskmanager_1.notebook.removeList(title);
            renderSideBar();
            addListButtons();
        };
        $('.delete-list').on('click', deleteList);
    };
    var tidy = function () {
        var makeTidy = function (event) {
            var title = $(event.target)
                .parent('li')
                .clone() //clone parent node
                .children() //select children
                .remove() //remove children
                .end() //go back to parent
                .text(); //retrive text
            var lists = taskmanager_1.notebook.getLists();
            var list = lists.filter(function (item) { return item.getTitle() == title; })[0];
            console.log(list);
            list.getChores().forEach(function (chore) {
                if (chore.getStatus() === true) {
                    list.deleteChore(chore);
                }
            });
            renderSideBar();
            addListButtons();
        };
        $('.clean-list').on('click', makeTidy);
    };
    //Add event listener to Add Chore Button
    var addChore = function () {
        var description = $('input').val().toString();
        var name = description.split(' ').join("-");
        var handleAddChore = function () {
            var newChore = new chore_1.Chore(name = name, desc = description);
        };
        $('#add-chore').on('click', handleAddChore);
    };
    ////
    var handleAddList = function () {
        var title = $('input').val().toString();
        var addList = function () {
            var newList = new list_1.List(title);
            taskmanager_1.notebook.addList(newList);
            renderListPage();
            addListButtons();
        };
        $('#new-form-submit').on('click', addList);
    };
    ////
    return {
        renderChorePage: renderChorePage,
        renderAddChorePage: renderAddChorePage,
        renderChore: renderChore,
        renderList: renderList,
        handleNewList: handleNewList,
        handleDeleteList: handleDeleteList,
        clearList: clearList,
        displayTitle: displayTitle,
        renderSideBar: renderSideBar,
        addListClick: addListClick,
        formatActive: formatActive,
        formatInactive: formatInactive,
        renderListPage: renderListPage
    };
})();
