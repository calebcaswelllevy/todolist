import { Chore } from './chore'

export class List {
    private chores:Chore[];
    private theme:string;
    private title:string;
    private status:boolean

    constructor(title:string, status:boolean, chores:Chore[] = [],) {
        this.chores = chores;
        this.status = status;
        this.title = title;
        this;
    }

    //Setters:
    setChores(chores:Chore[]){
        this.chores = chores
    }
    setStatus(status:boolean){
       this.status = status;
    }
    setTitle(title:string){
        this.title = title;
    }

    //Getters:
    getChores(){
        return this.chores.slice();
    }
    getStatus(){
       
        return this.status;
    }
    getTitle(){
        return this.title;
    }

    //Other methods:
    addChore(chore:Chore){
  
        this.chores.push(chore);
    }
    

    deleteChore(chore:Chore){
        let indexOfChore = this.chores.indexOf(chore);
        this.chores.splice(indexOfChore, 1);
    }

    getSortedChores() {
        let chores = this.getChores()
        chores.sort((a,b) => a.getPriority() > b.getPriority() ? 1 : -1)
        return chores;
    }
}
