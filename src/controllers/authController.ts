import { Request, Response, NextFunction } from 'express';
import Config from '../config';
const jwt = require('jsonwebtoken');

// Models
import User, {IUser} from '../models/User';

/*
return res.status(404).json({
    message: 'user not found'
})
return res.status(500).json('Internal Sever Error');
*/

class AuthController{

    //Register
    public async signup (req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body; //get data from body
            
            //Check if user exist
            const existUser = await User.findOne({email: email}) //find user by email

            if(existUser) {
                console.log('existUser: ', existUser)
                return res.status(400).json(
                    {
                        //auth:false,
                        code:125,
                        error: "This email is already used"
                    }
                )
            }
            

            const user: IUser = new User ({
                email: email,
                password: password
            })
            user.password = await user.encryptPassword(user.password) //apply encrypt password to userSchema 
            console.log('Saving user to DB: ', user);
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
        } catch (error) {
            console.log('-----Something was wrong------ \n', error)
            //next(error)
            res.status(500).send({message: error.message});
        }
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
        console.log('search for userId: ', req.userId);
        const user = await User.findById(req.userId, { password: 0 }); //get user by req.userId (witch is provide for verifyToken middleware) from db except password value
        if(!user){
            return res.status(404).send('Not user found');
        }

        res.json({
            message: 'user found',
            user
        })
     }

}


export const authController = new AuthController();