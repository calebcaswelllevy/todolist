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
        
        $(`#${location}`).append(`<div id="${chore.getName()}"></div>`)
        //$(`#${chore.getName()}`).draggable();
        $(`#${chore.getName()}`).addClass("container chore")
        //.append(`<div class = "chore-title">${chore.getName()}</div>`)
        $(`#${chore.getName()}`).append(`<div class="description">${chore.getDescription()}</div>`);
        $(`#${chore.getName()}`).append(`<input id="check-${chore.getName()}" type="checkbox" class="checkbox">`);
        addClickHandler(`#check-${chore.getName()}`, chore);
       
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
        
        let sortedList = list.getSortedChores();
       
        let days = ["Today", "Tomorrow", "Later"]
        for (let i = 0; i<days.length; i++){
            $(`#${location}`).append(`<div id='${days[i]}' class="day"><h2 class="day-name">${days[i]}<h2></div>`)
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

    const renderChorePage = () => {
        //make a stand in list:
        if (notebook.getLists().length == 0) {
        let todaysDate:Date = new Date();
        let tomorrowsDate:Date = new Date();
        tomorrowsDate.setDate(todaysDate.getDate()+1);
        let list1 = new List("Test List", true);
        let chore1 = new Chore("c1","a ting tp do", false,5,todaysDate);
        let chore2 = new Chore("c2","more fun", false,2, todaysDate);
        let chore3 = new Chore("another", "even more",  true, 1, tomorrowsDate)
        notebook.addList(list1);
        list1.addChore(chore1);
        list1.addChore(chore2);
        list1.addChore(chore3);
        notebook.addList(new List("Stuff Madison wants me to do", false))
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
        $('#side-nav').html('<h2 id="side-nav-title">Lists:</h2>')
        let lists = notebook.getLists();
        let n = lists.length;
        for (let i = 0; i<n; i++) {
            let title = lists[i].getTitle().split(' ').join('-');
            $('#side-nav').append(`<li id="${title}" class="nav-bar-list-element">${lists[i].getTitle()}</li>`);
        }
        addListButtons();
        addListClick();
        let list:List = notebook.getActiveList();
        let title = list.getTitle().split(' ').join('-');
        let activeList = document.getElementById(title)
        
        formatActive(activeList);
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
                let lists = notebook.getLists();
                let clicked;
                
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
                        break;
                    }
                }
               
                domManager.clearList();
                domManager.renderList(clicked, 'active-list');
                
                //remove formatting form other li:
                domManager.formatInactive();

                //format active list to make it stand out
                domManager.formatActive(list);
                
            
                
            }
            $(list).on('click', handleListClick);
            
            return;
        }
        let lists = getLists();
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

    //Function to render lists page
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
        
        
            //clear completed
            //delete list
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
            let title:string = $('input:text').val()
            let newList = new List(title);
            notebook.addList(newList);
            console.log('The new list is ', notebook.getLists())
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
            let [list]:List[] = lists.filter((item:List) => item.getTitle() == title); 
        
            list.getChores().forEach((chore) => {
               if (chore.getStatus() === true){
                   list.deleteChore(chore);
                }
            })
            
           
            renderSideBar();
            //if its on list page, redraw lists:
       
            if ($('#active-list').children("#days") !== undefined) {
                console.log()
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
            let name:string = description.split(' ').join("-");
            let priority:number = parseInt($('#priority').val());
            let dueDate:Date = new Date($('#date').val());
            let newChore:Chore = new Chore(name, description, false, priority, dueDate);
            notebook.getActiveList().addChore(newChore);
        
            

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

