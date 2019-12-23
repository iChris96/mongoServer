import { Request, Response } from 'express';

// Models
import Task from '../models/Task';

class TasksController{

    public createTaskGet (req: Request, res: Response) {
        res.render('tasks/create');
    }

    public async createTaskPost (req: Request, res: Response) {
        console.log(req.body);
        const { title, description } = req.body; //get data from form
        //create a Schema for mongoose with form data
        const newTaks = new Task({
            title, description
        })
        console.log(newTaks);
        //save schema to mongodb
        await newTaks.save();
        res.redirect('/tasks/list'); //res.send('saved');
     }

}


export const tasksController = new TasksController();