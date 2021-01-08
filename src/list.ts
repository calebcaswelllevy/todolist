import { Chore } from './chore'

export class List {
    private chores:Chore[];
    private theme:string;
    private title:string;

    constructor(chores:Chore[] = [], theme:string, title:string) {
        this.chores = chores;
        this.theme = theme;
        this.title = title;
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
        this.chores.push(chore);
    }
    deleteChore(chore:Chore){
        let indexOfChore = this.chores.indexOf(chore);
        this.chores.splice(indexOfChore, 1);
    }
}