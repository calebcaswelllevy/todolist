import {Chore} from './chore';
import {List} from './list';
import {TaskManager, notebook} from './taskmanager';
import * as $ from "jquery";



$(() => {
    //initialize the display
   domManager.displayTitle();
       
   domManager.renderChorePage();
    
})





export const domManager = (()=>{
  
    //function to render a chore
    const renderChore = (chore:Chore, location:string) => {
      
        $(`#${location}`).append(`<div id="${chore.getName().split(' ').join("-")}"></div>`)
        //$(`#${chore.getName()}`).draggable();
        $(`#${chore.getName().split(" ").join("-")}`).addClass("container chore")
       // .append(`<div class = "chore-title">${chore.getName()}</div>`)
        $(`#${chore.getName().split(" ").join("-")}`).append(`<div class="description">${chore.getDescription()}</div>`);
      
        $(`#${chore.getName().split(" ").join("-")}`).append(`<input id="check-${chore.getName()}" type="checkbox" class="checkbox">`);
        addClickHandler(`#check-${chore.getName().split(" ").join("-")}`, chore);
       
        return;
    }

    const addClickHandler = (element:string, chore:Chore) => {
        $(element).on("click", () => {
           
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
        if (list) {
        let sortedList:Chore[] = list.getSortedChores();
 
        let days = ["Today", "Tomorrow", "Later"]
        for (let i = 0; i<days.length; i++){
            $(`#${location}`).append(`<div id='${days[i]}' class="day"><h2 class="day-name">${days[i]}<h2></div>`)
        }

        
        for (let i = 0; i<sortedList.length; i++){
            let today = TaskManager.isToday(sortedList[i].getDueDate());
            let past = TaskManager.isPast(sortedList[i].getDueDate());
            let tomorrow = TaskManager.isTomorrow(sortedList[i].getDueDate());
            
            switch (true) {
                case today://Today's Date
                case past:    
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
    } else { //no existing lists
        $(`#${location}`).append(`<h2 class="day-name">Click Lists to get started</h2>`);
    }
}

    const renderChorePage = () => {
        
        
        //check for existing lists:
        if (localStorage.getItem("lists") !== null) {
            notebook.loadLists(); 
            domManager.renderSideBar();
        }
            else {  //Create stand in list
                
                let todaysDate:Date = new Date();
                let tomorrowsDate:Date = new Date();
                tomorrowsDate.setDate(todaysDate.getDate()+1);
                let list1 = new List("Example List", true);
                let chore1 = new Chore("A chore","Add new chores by clicking the add button", false,5,todaysDate);
                let chore2 = new Chore("chore 2","Start a new list by clicking Lists", false,2, todaysDate);
                let chore3 = new Chore("Another chore", "Toggle between Lists using the side bar",  true, 1, tomorrowsDate)
                let chore4 = new Chore("Learn List buttons", "The X button deletes a list, and the Tidy button removes completed tasks",  true, 1, tomorrowsDate)
                
                list1.addChore(chore1);
                list1.addChore(chore2);
                list1.addChore(chore3);
                list1.addChore(chore4);
                notebook.addList(list1);
                let lists = notebook.getLists()
                localStorage.setItem("lists", JSON.stringify({lists}))
               
            }
        
        
        $(`#main-display`).html(`
            <div id="active-list" class="container list-holder" >

            </div>
            <div id="bottom-menu" class="container">
                <button id="list-manager" class="btn">Lists</button>
                <button id="add" class="btn btn-primary">+</button>
            </div>`)
        let active:List = notebook.getActiveList();
        
        domManager.renderList(active, "active-list");
        domManager.renderSideBar();
        domManager.handleNewList();
       
        $('#list-manager').on('click', domManager.renderListPage);
        }

    //function to start a new list
    const handleNewList = () => {
        $('#add').on('click', renderAddChorePage)
    }
    //function to clear list display
    const clearList = () => {
        $('#active-list').html('');
        return;
    }
    const displayTitle = () => {
        $('#header').html(`<h1>${notebook.owner}'s To Do List</h1>`);
    }
    

    //function to render other lists
    const renderSideBar = () => {
        // Add sidebar <h2> element to navBar
        $('#side-nav').html('<h2 id="side-nav-title">Lists:</h2>');

        //Load Lists:
        let lists = notebook.getLists();
        let n = lists.length;
        if (n) {
        for (let i = 0; i<n; i++) {
            let title = lists[i].getTitle().split(' ').join('-');
            $('#side-nav').append(`<li id="${title}" class="nav-bar-list-element">${lists[i].getTitle()}</li>`);
        }
      
        addListButtons();
        addListClick();
        //In case there is no active list:
        if (!notebook.getActiveList()) {
            notebook.getLists()[0].setStatus(true);
        }
        
        let list:List = notebook.getActiveList();
        let title = list.getTitle().split(' ').join('-');
        let activeList = document.getElementById(title);
        
        formatActive(activeList);
    } else {
    //No Lists:
    
    $('#side-nav').append(`<li class="nav-bar-list-element">Add a new list to get started</li>`)
    }
} 
    

    //listener for list click:
        //change list status to active
        //remove active status from other list
        //render new active list in main display
    
    const addListClick = () => {
        const getLists = () => {
            let lists = $('#side-nav').children('li');
            return lists;
        }
        const addHandleListClick = (list:HTMLElement) => {
            const handleListClick = () => {
                let lists:List[] = notebook.getLists();
                let clicked:List;
                
                for (let i = 0; i< lists.length; i++) {
                    let title = lists[i].getTitle();
                    let text = $(list)
                        .clone() //clone parent node
                        .children()//select children
                        .remove()//remove children
                        .end()//go back to parent
                        .text();//retrive text
                    if (title === text) {
                        clicked = lists[i];

                        //change list status to active
                        clicked.setStatus(true)
                    } else {
                        //change all others to inactive status
                        lists[i].setStatus(false)
                    }
                }
               //erase the pallete
                domManager.clearList();
                //draw the active list in the active list spot
                domManager.renderList(clicked, 'active-list');
                
                //remove formatting form other li:
                domManager.formatInactive();

                //format active list to make it stand out
                domManager.formatActive(list);
                
                
                
            }
            //add event listener
            $(list).on('click', handleListClick);
            
            return;
        }
        //all lists in notebook:
        let lists = getLists();
        //add event listener to them all:
        for (let i = 0; i<lists.length; i++) {
            addHandleListClick(lists[i]);
        }
    }

    //Make active list stand out:
    const formatActive = (list:HTMLElement) => {
        $(list).css('list-style-type', 'hebrew')
            .css("box-shadow", "2px, 2px, 2px, #f4decb")
            .css("font-size", "1.2rem")
            .css("font-weight", "bold");
    }
    //make inactive lists base formatting:
    const formatInactive = () => {

        $('#side-nav').children('li').css('list-style-type', 'kannada')
            .css("box-shadow", "")
            .css("font-size", "")
            .css("font-weight", "");
     
    }

    //Function to show Lists page HTML and CSS
    const renderListPage = () => {
        //Clear main display
        $('#main-display').html(`
        <div id="list-form">
        <h2 class="day-name">Add a List</h2>
            <form id="new-list-form" autocomplete="off">
                <input id="new-form" type="text" placeholder="Enter a List Name">
                <input id="new-form-submit" for="new-form" type = "button" class="btn" value="Create List">
            </form>
         <div id="bottom-menu" class="container">
              <button id="list-manager" class="btn bottom-main-button">Chores</button>
              <button id="add" class="btn btn-primary">+</button>
         </div>
        </div>`)

        //put input form in main display
        $('#list-form').css('display', 'grid');
        //add buttons to lists:
        renderSideBar();
    
        //Add listener button to get back to main page:
        $('#list-manager').on('click', renderChorePage)
        handleNewList();
        handleAddList();

    }
    //function to render add chore page
    const renderAddChorePage = () => {
        $('#main-display').html(`
        <h2 class="day-name">New Chore</h2>
        <form id="new-chore-form" class="container" autocomplete="off">

            <label for="description">Description</label>
            <input id="description" type="text" placeholder="Enter a FUN new chore!" class="chore-input"></input>
            
            <label for="priority">Priority</label>
            <input id="priority" type="range" min="0" max="10" default=1 step=1 class="chore-input"></input>
           
            <label for="date">Due Date</label>
            <input id="date" type="date" class="chore-input"></input>
            
            <button id="add-chore" type="button">Add Chore</button>
        </form>
        <div id="bottom-menu" class="container">
            <button id="list-manager" class="btn">Chores</button>
            
        </div>
        `)
        renderSideBar();
        
        $('#list-manager').on('click', domManager.renderChorePage);
        addChore();
    }
    //function to create new list from buttons
    const handleAddList = () => {
       
        //let title = document.getElementById('new-form').value;
        const addList = () => {
            let title:string = $('input:text').val().toString();
            let newList = new List(title, false);
            notebook.addList(newList);
            if (!notebook.getActiveList()) {
                newList.setStatus(true);
            }
            renderListPage();
            renderSideBar();
            

        }
        $('#new-form-submit').on('click', addList)
    }
    const addListButtons = () => {
        $('#side-nav').children('li').append('<button class="delete-list list-btn">X</button>');
        $('#side-nav').children('li').append('<button class="clean-list list-btn">Tidy</button>');
        tidy();
        handleDeleteList();
    }
    //Delete old lists:
    const handleDeleteList = () => {
        const deleteList = (event) => { 
        let title = $(event.target)
            .parent('li')
            .clone() //clone parent node
            .children()//select children
            .remove()//remove children
            .end()//go back to parent
            .text();//retrive text
        notebook.removeList(title);
        let lists = notebook.getLists();
        localStorage.setItem("lists", JSON.stringify({lists}));
        renderSideBar();
        

        }
        $('.delete-list').on('click', deleteList)
    }
    const tidy = () => {
        const makeTidy = (event) => {
            let title = $(event.target)
                .parent('li')
                .clone() //clone parent node
                .children()//select children
                .remove()//remove children
                .end()//go back to parent
                .text();//retrive text
            let lists = notebook.getLists();
            let [list]:List[] = lists.filter((item:List) => item.getTitle() === title); 
        
            list.getChores().forEach((chore:Chore) => {
               
                if (chore.getStatus() === true){
                   list.deleteChore(chore);
                }
     
            })
            localStorage.setItem("lists", JSON.stringify({lists}));
           
            renderSideBar();
            //if its on list page, redraw lists:
       
            if ($('#active-list').children("#days") !== undefined) {
           
                clearList();
                renderChorePage();
            }
            
        }
        $('.clean-list').on('click', makeTidy);
    }

    //Add event listener to Add Chore Button
   const addChore = () => {
        const handleAddChore = () => {
            let description:string = $('#description').val().toString();
            console.log("description = ", description)
            let name:string = description.split(' ').join("-");
            let priority:number = parseInt($('#priority').val());
            let dueDate:Date = new Date($('#date').val());
            let newChore:Chore = new Chore(name, description, false, priority, dueDate);
            console.log("adding chore the choresare:", notebook.getLists())
            notebook.addToActiveList(newChore)
            console.log("added chore the choresare:", notebook.getLists())

            
            //The problem is that this isn't updating the lists, or is gettong
            //overwritten when rendering or loading hte main page
        }
        $('#add-chore').on('click', handleAddChore);
    }



    return {
        renderChorePage,
        renderAddChorePage,
        renderChore,
        renderList,
        handleNewList,
        handleDeleteList,
        clearList,
        displayTitle,
        renderSideBar,
        addListClick,
        formatActive,
        formatInactive,
        renderListPage,
    };
})();

