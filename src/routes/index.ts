import { Router, Request, Response } from 'express'

const router = Router();

router.get(
    '/', 
    (req:Request, res:Response) => {
        if(req.session)
        {
            const user = req.session.username;

            if(!user){
                res.redirect('/auth/login');
            }
            else{
                res.render('index',{user});
            }
        }
    })
    


export default router;