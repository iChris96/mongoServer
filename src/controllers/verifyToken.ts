import { Request, Response, NextFunction } from 'express';
import Config from '../config';
import jwt from 'jsonwebtoken'

interface IPayload  {
    _id: string;
    iat: number;
    exp: number;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction)  => {
    const token = req.header('auth-token'); //pass token as x-access-token header value
    if (!token){
        return res.status(401).json({
            auth: false,
            message: 'No token provided'
        })
    }
    console.log('token from headers received: ', token);
    const decoded = jwt.verify(token, Config.secret || 'sometoken') as IPayload;
    console.log('decoded token: ', decoded);
    (req as any).userId = decoded._id;
    next(); 
}