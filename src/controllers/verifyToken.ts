import { Request, Response, NextFunction } from 'express';
import Config from '../config';
import jwt from 'jsonwebtoken'

export interface IPayload  {
    id: string;
    iat: number;
    exp: number;
}

export  const verifyToken = async (req: Request, res: Response, next: NextFunction)  => {
    const token = req.header('auth-token'); //pass token as x-access-token header value
    if (!token){
        return res.status(401).json({
            auth: false,
            message: 'No token provided'
        })
    }
    console.log('token from headers received: ', token);
    const decoded = await jwt.verify(token, Config.secret || 'sometoken') as IPayload;
    console.log('decoded token: ', decoded);
    console.log('decoded id: ', decoded.id);
    //console.log('decoded id123: ', (decoded as IPayload).iat);
    //console.log('decoded id123: ', decoded.exp);
    req.userId = decoded.id
    console.log('the req as any = ', req.userId);
    
    next(); 
}