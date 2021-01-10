import {Chore} from './chore';
import {List} from './list';
import {TaskManager, notebook} from './taskmanager';
import * as $ from "jquery";

$(() => {
    
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
   domManager.displayTitle();
    //make a stand in list:
    let todaysDate:Date = new Date();
    let tomorrowsDate:Date = new Date();
    tomorrowsDate.setDate(todaysDate.getDate()+1);
    let list1 = new List([],"","Test List");
    let chore1 = new Chore("c1",false,5,todaysDate,"Something to do");
    let chore2 = new Chore("c2",false,2, todaysDate,"Something to do");
    let chore3 = new Chore("another", true, 1, tomorrowsDate, "Thing to do")
    notebook.addList(list1);
    list1.addChore(chore1);
    list1.addChore(chore2);
    list1.addChore(chore3);
    domManager.renderList(list1, "active-list");

})





export const domManager = (()=>{
  
    //function to render a chore
    const renderChore = (chore:Chore, location:string) => {
        
        $(`#${location}`).append(`<div id="${chore.getName()}" draggable="true" ondrag="drag(event)" ></div>`)
        $(`#${chore.getName()}`).addClass("container").append(`<div class = "chore-title">${chore.getName()}</div>`)
        $(`#${chore.getName()}`).append(`<div>${chore.getDescription()}</div>`);
        $(`#${chore.getName()}`).append(`<div>${chore.getDueDate()}</div>`);
        $(`#${chore.getName()}`).append(`<input id="check-${chore.getName()}" type="checkbox">`);
        addClickHandler(`#check-${chore.getName()}`, chore);
        
        return;
    }

    const addClickHandler = (element:string, chore:Chore) => {
        $(element).on("click", () => {
           //TODO: make this remove this chore from the DOM
                    //make it remove from the list also
            if (chore.getStatus() === false) {
                chore.setStatus(true);
                $(element).parent().css("text-decoration","line-through")
            } else {
                chore.setStatus(false);
                $(element).parent().css("text-decoration","none")
            }
            
        })
    }
  
    //function to render active list
    const renderList = (list:List, location:string) => {
        let sortedList = list.getSortedChores();
        let days = ["Today", "Tomorrow", "Later"]
        for (let i = 0; i<days.length; i++){
            $(`#${location}`).append(`<div id='${days[i]}' ondrop="drop(event)" ondragover="allowDrop(event)">${days[i]}</div>`)
        }

            
        for (let i = 0; i<sortedList.length; i++){
            let today = TaskManager.isToday(sortedList[i].getDueDate())
            let tomorrow = TaskManager.isTomorrow(sortedList[i].getDueDate())
            switch (true) {
                case today://Today's Date
                    domManager.renderChore(sortedList[i], `Today`);
                    break;
                case tomorrow: //Tomorrow's Date
                    domManager.renderChore(sortedList[i], `Tomorrow`);
                    break;
                case true: //after tomorrow
                    domManager.renderChore(sortedList[i], 'Later');
                    break;
            }
        }
        
        return;
    }



    //function to start a new list
    const startNewList = () => {
        return;
    }
    //function to clear list display
    const clearList = () => {
        return;
    }
    const displayTitle = () => {
        $('#header').html(`<h1>${notebook.owner}'s To Do List</h1>`);
    }
    //function to style active chore

    //function to remove checked chore

    return {
        renderChore,
        renderList,
        startNewList,
        clearList,
        displayTitle,
    };
})();

