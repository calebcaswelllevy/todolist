import { Chore } from './chore'

export class List {
    private chores:Chore[];
    private theme:string;
    private title:string;
    
    constructor(title:string, theme:string = "", chores:Chore[] = [],) {
        this.chores = chores;
        this.theme = theme;
        this.title = title;
        this;
    }

    //Setters:
    setChores(chores:Chore[]){
        this.chores = chores
    }
    setTheme(theme:string){
       this.theme = theme;
    }
    setTitle(title:string){
        this.title = title;
    }

    //Getters:
    getChores(){
        return this.chores.slice();
    }
    getTheme(){
        return this.theme;
    }
    getTitle(){
        return this.title;
    }

    //Other methods:
    addChore(chore:Chore){
        console.log("this should be list")
        console.log('this is: ', this)
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
