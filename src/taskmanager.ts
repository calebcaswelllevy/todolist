import {List} from './list';
import {Chore} from './chore';

//use the revealing module pattern for this one
export const TaskManager = (() => {

   //Find out if a chore is due on a certain date:

   const due = (chore:Chore, date:Date) => {
    // if the days and months match:
    if (chore.getDueDate().getMonth() === date.getMonth() && chore.getDueDate().getDate() === date.getDate()) {
        return true;
    }
    else  //not the same date, so not due:
    {
        return false;
    }
}

    //Find tasks on a list due today:

    const getChoresDueToday = (list:List) => {
        //Get today's date:
        let today = new Date();
        //get the chores on the list object:
        let chores = list.getChores();
        //initialize the list of chores due today:
        let choresDueToday = [];

        for (let i = 0; i < chores.length; i++){
            //if its due today, add it to the list:
            if (due(chores[i], today)) {
                choresDueToday.push(chores[i]);
            }
        }
        return choresDueToday;
    }
    
    //Find Undone tasks on a list:
    const getUnfinishedChores = (list:List) => {

        //initialize list of undone tasks
        let unfinishedChores = [];

        //get a copy of the array of chores:
        let chores = list.getChores();

        //loop through and add the chores that have not been completed:
        for (let i = 0; i<chores.length; i++) {
            if (!chores[i].getStatus()) {
                unfinishedChores.push(chores[i]);
            }
        }
        return unfinishedChores;
    }

    //Find Completed Tasks:
    const getFinishedChores = (list:List) => {
         //initialize list of done tasks
         let finishedChores = [];

         //get a copy of the array of chores:
         let chores = list.getChores();
 
         //loop through and add the chores that have been completed:
         for (let i = 0; i<chores.length; i++) {
             if (chores[i].getStatus()) {
                 finishedChores.push(chores[i]);
             }
         }
         return finishedChores;
     }
    

    //Remove completed tasks from list
    const removeCompleted = (list:List, chore:Chore) => {
        if (chore.getStatus()){
            list.deleteChore(chore);
        } 
    }
    const isToday = (someDate:Date) => {
        const today = new Date()
        return someDate.getDate() == today.getDate() &&
          someDate.getMonth() == today.getMonth() &&
          someDate.getFullYear() == today.getFullYear()
      }
      const isTomorrow = (someDate:Date) => {
        const today = new Date()
        return someDate.getDate() == (today.getDate() + 1) &&
          someDate.getMonth() == today.getMonth() &&
          someDate.getFullYear() == today.getFullYear()
      }
    return {
        getChoresDueToday,
        getUnfinishedChores,
        getFinishedChores,
        removeCompleted,
        isToday,
        isTomorrow,
    }
})();

export const notebook = (()=>{
   /* if(localStorage.getItem("lists")){
        //parse string to arr of lists
        let listarr:string[] = localStorage.getItem("lists");
        listarr.forEach(list => {
            let newList = JSON.parse(list)
        })
    } else { */
        //initialize lists
        const lists = [];
   // }
       
    
    const addList = (list) => {
        lists.push(list);
        localStorage.setItem("lists", lists.toString());
        
    }
    
    const removeList = (title) => {
        lists.forEach((list, index) => {
            if (list.getTitle() == title){
                lists.splice(index,1);
            }
        })
        ;
        localStorage.setItem("lists", lists)
    }
    const getLists = () => {
        return lists;
    }
    let owner = "Caleb"
    return {addList,
           removeList,
            getLists,
            owner }
})();

