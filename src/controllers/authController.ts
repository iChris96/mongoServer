import { Request, Response, NextFunction } from 'express';
import Config from '../config';
const jwt = require('jsonwebtoken');

// Models
import User, {IUser} from '../models/User';


class AuthController{

    //Register
    public async signup (req: Request, res: Response, next: NextFunction) {
        const { userName, email, password } = req.body; //get data from body
        const user: IUser = new User ({
            userName: userName,
            email: email,
            password: password
        })
        user.password = await user.encryptPassword(user.password) //apply encrypt password to userSchema 
        console.log(user)
        await user.save(); //save user to db

        //create token
        const token = jwt.sign({id: user._id}, Config.secret, {
            expiresIn: 60 * 60 * 24 //1 dia
        });
        console.log('Token created: ', token);

        res.header('auth-token',token).json(
                {
                    message: 'User Save',
                    token: token
                }
            )
    }

    //Start Session
    public async signin (req: Request, res: Response, next: NextFunction) {
        //get user data from db
        const { email, password } = req.body
        const user = await User.findOne({email: email}) //find user by email
        if(!user) {
            return res.status(404).send(
                {
                    auth:false,
                    message: "Email doesn't exists"
                }
            )
        }

        //validate provided password
        const validPassword = await user.validatePassword(password); //true if password is valid
        console.log(validPassword);
        if(!validPassword){
            return res.status(401).send(
                {
                    auth:false,
                    message: "incorrect data"
                }
            )
        }

        //create token
         const token:string = jwt.sign({id: user._id}, Config.secret, {
            expiresIn: 60 * 60 * 24 //1 dia
        });
        console.log(token);

        //return token + response
        res.header('auth-token',token).json({
            auth: true,
            token: token
        })
     }

     //Get user info by token
     public async me (req: Request, res: Response, next: NextFunction){
        /*const user = await User.findById('token123', { password: 0 }); //get user by req.userId (witch is provide for verifyToken middleware) from db except password value
        if(!user){
            return res.status(404).send('Not user found');
        }*/

        res.json({
            message: 'user found',
            
        })
     }

}


export const authController = new AuthController();