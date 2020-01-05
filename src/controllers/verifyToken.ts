import { Request, Response, NextFunction } from 'express';
import Config from '../config';
const jwt = require('jsonwebtoken');

export default function verifyToken(req: Request , res: Response, next: NextFunction) {
    const token = req.headers['x-access-token']; //pass token as x-access-token header value
    if (!token) {
        return res.status(401).json({
            auth: false,
            message: 'No token provided'
        })
    }
    console.log('token received: ', token);
    const decoded = jwt.verify(token, Config.secret);
    req.userId = decoded.id;
    next();
}