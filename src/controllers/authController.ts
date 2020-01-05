import { Request, Response, NextFunction } from 'express';

// Models
import User, {IUser} from '../models/User';


class AuthController{

    //Register
    public async signup (req: Request, res: Response, next: NextFunction) {
        const { userName, email, password } = req.body;
        const user: IUser = new User ({
            userName: userName,
            email: email,
            password: password
        })
        user.password = await user.encryptPassword(user.password)
        console.log(user)
        res.json('signup')
    }

    //Start Session
    public async signin (req: Request, res: Response, next: NextFunction) {
        res.json('signin')
        /*console.log( req.body);
        const { title, description } = req.body; //get data from form
        //create a Schema for mongoose with form data
        const newTaks = new Task({
            title, description
        })
        console.log(newTaks);
        //save schema to mongodb
        await newTaks.save();

        res.redirect('/tasks/list'); //res.send('saved');*/
     }
     public me (req: Request, res: Response, next: NextFunction){
        res.json('me')
     }

}


export const authController = new AuthController();