"use strict";
exports.__esModule = true;
exports.notebook = exports.TaskManager = void 0;
//use the revealing module pattern for this one
exports.TaskManager = (function () {
    //Find out if a chore is due on a certain date:
    var due = function (chore, date) {
        // if the days and months match:
        if (chore.getDueDate().getMonth() === date.getMonth() && chore.getDueDate().getDate() === date.getDate()) {
            return true;
        }
        else //not the same date, so not due:
         {
            return false;
        }
    };
    //Find tasks on a list due today:
    var getChoresDueToday = function (list) {
        //Get today's date:
        var today = new Date();
        //get the chores on the list object:
        var chores = list.getChores();
        //initialize the list of chores due today:
        var choresDueToday = [];
        for (var i = 0; i < chores.length; i++) {
            //if its due today, add it to the list:
            if (due(chores[i], today)) {
                choresDueToday.push(chores[i]);
            }
        }
        return choresDueToday;
    };
    //Find Undone tasks on a list:
    var getUnfinishedChores = function (list) {
        //initialize list of undone tasks
        var unfinishedChores = [];
        //get a copy of the array of chores:
        var chores = list.getChores();
        //loop through and add the chores that have not been completed:
        for (var i = 0; i < chores.length; i++) {
            if (!chores[i].getStatus()) {
                unfinishedChores.push(chores[i]);
            }
        }
        return unfinishedChores;
    };
    //Find Completed Tasks:
    var getFinishedChores = function (list) {
        //initialize list of done tasks
        var finishedChores = [];
        //get a copy of the array of chores:
        var chores = list.getChores();
        //loop through and add the chores that have been completed:
        for (var i = 0; i < chores.length; i++) {
            if (chores[i].getStatus()) {
                finishedChores.push(chores[i]);
            }
        }
        return finishedChores;
    };
    //Remove completed tasks from list
    var removeCompleted = function (list, chore) {
        if (chore.getStatus()) {
            list.deleteChore(chore);
        }
    };
    var isToday = function (someDate) {
        var today = new Date();
        return someDate.getDate() == today.getDate() &&
            someDate.getMonth() == today.getMonth() &&
            someDate.getFullYear() == today.getFullYear();
    };
    var isTomorrow = function (someDate) {
        var today = new Date();
        return someDate.getDate() == (today.getDate() + 1) &&
            someDate.getMonth() == today.getMonth() &&
            someDate.getFullYear() == today.getFullYear();
    };
    return {
        getChoresDueToday: getChoresDueToday,
        getUnfinishedChores: getUnfinishedChores,
        getFinishedChores: getFinishedChores,
        removeCompleted: removeCompleted,
        isToday: isToday,
        isTomorrow: isTomorrow
    };
})();
exports.notebook = (function () {
    /* if(localStorage.getItem("lists")){
         //parse string to arr of lists
         let listarr:string[] = localStorage.getItem("lists");
         listarr.forEach(list => {
             let newList = JSON.parse(list)
         })
     } else { */
    //initialize lists
    var lists = [];
    // }
    var addList = function (list) {
        lists.push(list);
        localStorage.setItem("lists", lists.toString());
    };
    var removeList = function (title) {
        lists.forEach(function (list, index) {
            if (list.getTitle() == title) {
                lists.splice(index, 1);
            }
        });
        localStorage.setItem("lists", lists);
    };
    var getLists = function () {
        return lists;
    };
    var owner = "Caleb";
    return { addList: addList,
        removeList: removeList,
        getLists: getLists,
        owner: owner };
})();
