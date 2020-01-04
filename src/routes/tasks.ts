import { Router, Request, Response } from 'express'
import { tasksController } from '../controllers/tasksController'

const router = Router();

// Models
import Task from '../models/Task';


//CREATE TASK
router.route('/create')
    .get(
        tasksController.createTaskGet
    )
    .post(
        tasksController.createTaskPost
    );

//GET TASKS
router.route('/list')
        .get(
            async (req: Request, res: Response) => {
                const taskList = await Task.find();
                console.log(taskList);
                res.render('tasks/list', { taskList });
            }
        );

router.route('/all')
        .get(
            async (req: Request, res: Response) => {
                const taskList = await Task.find();
                console.log(taskList);
                return res.status(200).json(taskList);
            }
        );


//DELETE TASK
router.route('/delete/:id')
    .get(
          async (req: Request, res: Response) => {

            const { id } = req.params;
            console.log(id);

            await Task.findByIdAndDelete(id);

            res.redirect('/tasks/list'); 

        }
    );

//Edit TASK
router.route('/edit/:id')
    .get(
        async (req: Request, res: Response) => {
            const { id } = req.params;
            //console.log(id);
            const task = await Task.findById(id);
            //console.log(task);

            res.render('tasks/edit', { task });
        }
    )
    .post(
        async (req: Request, res: Response) => {
            const { id } = req.params //get data from url 
            const { title, description } = req.body; //get data from form

            //update task into db
            await Task.findByIdAndUpdate(id, {title, description});

            res.redirect('/tasks/list');
        }       
    )    


/*
router.get(
    '/', 
    (req:Request, res:Response) => {
        res.render('index');
    }
)
*/

export default router;