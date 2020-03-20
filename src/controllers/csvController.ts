import { Request, Response } from 'express';
import fs from 'fs';
//import csv from 'csv-parser'
var csvjson = require('csvjson');
// Models
import Csv from '../models/Csv';
import Entries from '../models/Entries';

class CsvController {
	public createCsvGet(req: Request, res: Response) {
		res.render('csv/create_csv');
	}

	public async createCsvPost(req: Request, res: Response) {
		// let MyData: any[] = [];
		try {
			//! READ CSV
			let options = {
				delimiter: ',', // optional
				quote: '"' // optional
			};
			let file_data = fs.readFileSync(req.file.path, { encoding: 'utf8' });
			let result = csvjson.toSchemaObject(file_data, options);
			console.log(result); //Converted json object from csv data

			//! Transform data to knn format

			// csv format -> station,date,entries,exit
			// knn format -> station,entries,hour,minutes

			await Entries.insertMany(result); //save data into Collection A (original - csv format)
			await Csv.insertMany(result); //save data into Colleccion C (aux - csv format)

			//transform and save data into Collection B (EntriesKNN - knn format)
			await Csv.aggregate([
				{
					$project: {
						_id: 0,
						station: 1,
						day: {
							$dayOfMonth: {
								$dateFromString: {
									dateString: '$datetime',
									format: '%d/%m/%Y %H:%M'
								}
							}
						},
						hour: {
							$hour: {
								$dateFromString: {
									dateString: '$datetime',
									format: '%d/%m/%Y %H:%M'
								}
							}
						},
						minutes: {
							$minute: {
								$dateFromString: {
									dateString: '$datetime',
									format: '%d/%m/%Y %H:%M'
								}
							}
						},
						entries: 1
					}
				},
				{ $merge: 'entriesKNN' }
			]);

			await Csv.collection.drop(); //remove Collection C (aux)
		} catch (err) {
			console.error(err);
		}
		res.redirect('/create');
	}
}

export const csvController = new CsvController();
