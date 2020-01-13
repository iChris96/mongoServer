import { Request, Response, NextFunction } from 'express';
import Config from '../config';
import jwt from 'jsonwebtoken'

export interface IPayload  {
    id: string;
    iat: number;
    exp: number;
}

export  const verifyToken = async (req: Request, res: Response, next: NextFunction)  => {
    console.log('---verifyToken----');
    const userToken = req.header('auth-token'); //get token from headers
    console.log('userToken: ', userToken);
    
    if (!userToken){
        return res.status(401).json({
            auth: false,
            message: 'No token provided'
        })
    }

    try {
        const decoded = await jwt.verify(userToken, Config.secret || 'sometoken') as IPayload
        req.userId = decoded.id
        console.log('userID from decoded token: ', req.userId);
        next(); 
    } catch (error) {
        //App will try to refresh token otherwise go to register/login view
        res.status(401).send({message: error.message});
    } 
}