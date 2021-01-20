import { Chore } from './chore'

export class List {
    private chores:Chore[];
    private title:string;
    private status:boolean

    constructor(title:string, status:boolean, chores:Chore[] = []) {
        this.chores = chores;
        this.status = status;
        this.title = title;
       
    }

    //Setters:
    public setChores(chores:Chore[]){
        this.chores = chores
    }
    public setStatus(status:boolean){
       this.status = status;
    }
    public setTitle(title:string){
        this.title = title;
    }

    //Getters:
    public getChores(){
        return this.chores.slice();
    }
    public getStatus(){
       
        return this.status;
    }
    public getTitle(){
        return this.title;
    }

    //Other methods:
    public addChore(chore:Chore){
  
        this.chores.push(chore);
    }
    

    deleteChore(chore:Chore){
        let indexOfChore = this.chores.indexOf(chore);
        this.chores.splice(indexOfChore, 1);
    }

    getSortedChores() {
        let chores:Chore[] = this.getChores()
        chores.sort((a,b) => a.getPriority() > b.getPriority() ? 1 : -1)
        return chores;
    }
}
