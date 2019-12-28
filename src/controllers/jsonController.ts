import { Request, Response } from 'express';
import fs from 'fs';

// Models
import Json from '../models/json';

class JsonController{

    public createJsonGet (req: Request, res: Response) {
        res.render('json/create');
    }

    public createJsonPost(req: Request,res: Response) {
        //file es el archivo que subimos desde el formulario
        try {
            const data = fs.readFileSync(req.file.path, 'utf8')
            let docs = JSON.parse(data);
            Json.insertMany(docs); //Insertamos en la base de datos
          } catch (err) {
            console.error(err)
          }
          res.redirect('/');
    }

}


export const jsonController = new JsonController();