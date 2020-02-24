import { Request, Response } from 'express';
const KNN = require('@artificialscience/k-nn');
const nn = require('nearest-neighbor');
import EntriesKNN, { IEntriesKnn } from '../models/EntriesKNN';

interface data {
	entries: number;
	day: number;
	hour: number;
	minutes: number;
}

class KnnController {
	public async test(req: Request, res: Response) {
		/*let entries = await EntriesKNN.find(
			{ station: 'Andrew Square' }
        );*/

		//CALL ENTRIES BY STATION
		/*let entries = await EntriesKNN.find(
			{ station: 'Andrew Square' },
			'-_id day hour minutes entries',
			function(err, entity) {
				//console.log(entity); // { field1: '...', field2: '...' }
			}
        );*/
		let entries = await EntriesKNN.aggregate([
			{
				$project: {
					_id: 0,
					day: 1,
					hour: 1,
					minutes: 1,
					entries: 1
				}
			}
		]);

		console.log('Entries count: ', entries.length);

		//GET FIRST 15 ENTRIES
		let first15Entries: Array<IEntriesKnn> = entries.slice(0, 15);
		console.log('First15 count: ', first15Entries.length);
		//console.log(first15Entries[0]);
		//console.log(first15Entries);

		let features: Array<Array<Number>> = first15Entries.map(item => {
			//console.log(item);
			//console.log(Object.values(item.toObject()));
			return [item.day, item.hour, item.minutes, item.entries];
		});

		console.log(features);

		/*const features = [
			[1, 0, 0, 0, 15, 23, 10, 1],
			[1, 0, 0, 0, 28, 20, 40, 5],
			[0, 0, 0, 1, 28, 20, 30, 30],
			[0, 0, 0, 1, 28, 20, 40, 40],
			[0, 0, 0, 1, 28, 20, 50, 50],
			[0, 0, 0, 1, 28, 20, 40, 40],
			[0, 0, 0, 1, 28, 20, 50, 50],
			[0, 0, 0, 1, 28, 20, 40, 40],
			[0, 0, 0, 1, 28, 20, 50, 50],
			[0, 0, 0, 1, 28, 20, 40, 40],
			[0, 0, 0, 1, 28, 20, 50, 50],
			[0, 1, 0, 0, 4, 15, 45, 1],
			[0, 0, 1, 0, 6, 15, 10, 0],
			[0, 0, 0, 1, 9, 15, 5, 1]
        ];*/

		/*
            [ [ 1, 1, 4, 32 ],
        [1]   [ 0, 1, 4, 34 ],
        [1]   [ 2, 1, 5, 10 ],
        [1]   [ 1, 1, 5, 11 ],
        [1]   [ 1, 1, 5, 12 ],
        [1]   [ 1, 1, 5, 13 ],
        [1]   [ 1, 1, 5, 14 ],
        [1]   [ 2, 1, 5, 19 ],
        [1]   [ 1, 1, 5, 17 ],
        [1]   [ 2, 1, 5, 20 ],
        [1]   [ 1, 1, 5, 22 ],
        [1]   [ 10, 1, 5, 23 ],
        [1]   [ 3, 1, 5, 24 ],
        [1]   [ 5, 1, 5, 25 ],
        [1]   [ 2, 1, 5, 26 ] ]
        */

		const euclidian = (a: Array<number>, b: Array<number>) => {
			return (
				a
					.map((euclidian, i) => Math.abs(euclidian - b[i]) ** 2) // square the difference
					.reduce((sum, now) => sum + now) ** // sum
				(1 / 2)
			);
		};

		//dimension, goalIndex, customDistanceFunction, customGoalFunction
		const knn = new KNN(3, 0, euclidian);
		//outpts, testSize, shuffleTimes, ktimes, normalize
		let [accuracy, k] = knn.training(features, 2, features.length, 2, false);
		let goal = knn.predict(features, [10, 1, 5]);

		console.log(
			'Accuracy about: ' +
				accuracy +
				', k: ' +
				k +
				', was predicted the goal as: ' +
				goal
		);

		res.json({ amazing: 'amazing' });
	}

	public test2(req: Request, res: Response) {
		//https://github.com/aschuch/node-nearest-neighbor
		var items = [
			{ name: 'Bill', age: 10, pc: 'Mac', ip: '68.23.13.8' },
			{ name: 'Alice', age: 22, pc: 'Windows', ip: '193.186.11.3' },
			{ name: 'Bob', age: 12, pc: 'Windows', ip: '56.89.22.1' }
		];

		var query = { name: 'Billy', age: 12, pc: 'Windows', ip: '68.23.13.10' };

		var fields = [
			{ name: 'name', measure: nn.comparisonMethods.word },
			{ name: 'age', measure: nn.comparisonMethods.number, max: 100 },
			{ name: 'pc', measure: nn.comparisonMethods.word },
			{ name: 'ip', measure: nn.comparisonMethods.ip }
		];

		nn.findMostSimilar(query, items, fields, function(
			nearestNeighbor: any,
			probability: any
		) {
			console.log(query);
			console.log(nearestNeighbor);
			console.log(probability);
		});
		res.json({ amazing2: 'amazing2' });
	}
}

export const knnController = new KnnController();
