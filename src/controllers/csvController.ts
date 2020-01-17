import { Request, Response } from 'express';
import fs from 'fs';
//import csv from 'csv-parser'
var csvjson = require('csvjson');
// Models
import Csv from '../models/Csv';

class CsvController{

    public createCsvGet (req: Request, res: Response) {
        res.render('csv/create_csv');
    }

    public async createCsvPost(req: Request,res: Response) {
     // let MyData: any[] = [];
        try {
          let options = {
            delimiter: ',',  // optional
            quote     : '"' // optional
            }
          let file_data = fs.readFileSync(req.file.path, { encoding : 'utf8'});
          let result = csvjson.toSchemaObject(file_data, options);
          //console.log(result); //Converted json object from csv data
           await Csv.insertMany(result);
            
          } catch (err) {
            console.error(err)
          }
          res.redirect('/create');
    }

}


export const csvController = new CsvController();