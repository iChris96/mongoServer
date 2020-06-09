import { Request, Response } from 'express';
import fs from 'fs';
//import csv from 'csv-parser'
var csvjson = require('csvjson');
// Models
import Csv from '../models/Csv';
import Entries from '../models/Entries';
import Stops from '../models/Stops';
import CleanEntries from '../models/CleanEntries';
import EntriesKNN from '../models/EntriesKNN';

class CsvController {
	public createCsvGet(req: Request, res: Response) {
		res.render('csv/create_csv');
	}

	public async resetRandomEntries(req: Request, res: Response) {
		//Entries -> csv-format -> 1'000,000
		//CsvEntries -> csv-format -> 31'000
		//EntriesKNN -> knn-format -> 31'000
		await CleanEntries.collection.drop();
		await EntriesKNN.collection.drop();

		const stations = await Stops.find();

		//get 1000 size sample for each station in Entries csv-format data and make entriesClean collection
		for (const x of stations) {
			await Entries.aggregate([
				{ $match: { station: x.properties.csvName } },
				{ $sample: { size: 4000 } },
				{ $merge: 'entriesClean' }
			]);
		}

		//re-build EntriesKNN collection by new entriesClean collection
		await CleanEntries.aggregate([
			{
				$project: {
					_id: 0,
					station: 1,
					day: {
						$dayOfMonth: {
							$dateFromString: {
								dateString: '$datetime'
								//format: '%d/%m/%Y %H:%M'
							}
						}
					},
					hour: {
						$hour: {
							$dateFromString: {
								dateString: '$datetime'
								//format: '%d/%m/%Y %H:%M'
							}
						}
					},
					minutes: {
						$minute: {
							$dateFromString: {
								dateString: '$datetime'
								//format: '%d/%m/%Y %H:%M'
							}
						}
					},
					entries: 1
				}
			},
			{ $merge: 'entriesKNN' }
		]);

		res.send({ ok: 'ok' });
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
			console.log('result: ', result); //Converted json object from csv data

			//! Transform data to knn format

			// csv format -> station,date,entries,exit
			// knn format -> station,entries,hour,minutes

			//save new data into CleanEntries as CSV format & save new data into entriesKNN in KNN format
			//await Entries.insertMany(result); //save data into Collection A (original - csv format)
			await CleanEntries.insertMany(result); //save data into Collection A.clean (original clean - csv format)
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
		const redirect = '/csv/create';
		console.log('redict to: ', redirect);
		res.redirect(redirect);
	}
}

export const csvController = new CsvController();
