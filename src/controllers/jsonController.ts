import { Request, Response } from 'express';
import fs from 'fs';

// Models
import json from '../models/json';

class JsonController{

    public createJsonGet (req: Request, res: Response) {
        res.render('json/create');
    }

    public createJsonPost(req: Request,res: Response) {
        //file es el archivo que subimos desde el formulario
        try {
            const data = fs.readFileSync(req.file.path, 'utf8')
             var ok = JSON.parse(data);
            console.log(ok);
          } catch (err) {
            console.error(err)
          }
        res.send('ok');
    }

}


export const jsonController = new JsonController();