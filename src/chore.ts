export class Chore {
    private name:string;
    private status:boolean;
    private priority:number;
    private dueDate:Date;
    private description:string;
    
    constructor (name:string, status:boolean = false, priority:number = 0,
                    date:Date = null, desc:string){
        this.name = name;
        this.status = status;
        this.priority = priority;
        this.dueDate = date;
        this.description = desc;
    }

    //setters:
    public setName(name:string){
        this.name = name;
    }
    public setStatus(status:boolean){
        this.status = status;
    }
    public setPriority(priority:number) {
        this.priority = priority;
    }
    public setDueDate(date:Date){
        this.dueDate = date;
    }
    public setDescription(desc:string){
        this.description = desc;
    }

    //Getters:
    public getName(){
        return this.name;
    }
    public getStatus(){
        return this.status;
    }
    public getPriority(){
        return this.priority;
    }
    public getDueDate(){
        return this.dueDate;
    }
    public getDescription(){
        return this.description;
    }

}