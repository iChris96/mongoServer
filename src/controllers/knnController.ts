import { Request, Response } from 'express';
import { Decimal128 } from 'bson';
const KNN = require('@artificialscience/k-nn');
const nn = require('nearest-neighbor');
import EntriesKNN from '../models/EntriesKNN';

interface instancia {
	x: number;
	y: number;
	z: number;
}

class KnnController {
	public async test(req: Request, res: Response) {
		//https://www.npmjs.com/package/@artificialscience/k-nn
		/*const features = [
			[10, 0.5068958512233102, 16, 1],
			[12, 0.5105356367730379, 16, 7],
			[12, 0.5323562633463617, 16, 7],
			[40, 0.517546804614676, 16, 2],
			[48, 0.5158030616769878, 16, 2],
			[83, 0.5262942735596369, 16, 6],
			[80, 0.5362942735596369, 16, 6],
			[97, 0.5281527464327415, 16, 100],
			[98, 0.5148717143151224, 16, 100],
			[99, 0.5248717143151224, 16, 100],
			[100, 0.5148717143151224, 16, 100],
			[98, 0.5448717143151224, 16, 100],
			[98, 0.5648717143151224, 16, 100],
			[94, 0.5148717143151224, 16, 100],
			[98, 0.52148717143151224, 16, 100]
        ];*/

		/*const features = [
			[10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0.5, 16, 5],
			[10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0.9, 16, 5],
			[10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0.8, 16, 40],
			[10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0.6, 16, 12],
			[10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0.9, 16, 8],
			[10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0.11, 16, 4],
			[10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0.7, 16, 9]
        ];
        */

		let entries = await EntriesKNN.find({ station: 'Andrew Square' });
		console.log(entries.length);

		const features = [
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
		];

		const x = (a: Array<number>, b: Array<number>) => {
			return (
				a
					.map((x, i) => Math.abs(x - b[i]) ** 2) // square the difference
					.reduce((sum, now) => sum + now) ** // sum
				(1 / 2)
			);
		};

		//dimension, goalIndex, customDistanceFunction, customGoalFunction
		const knn = new KNN(7, 7, x);
		//outpts, testSize, shuffleTimes, ktimes, normalize
		let [accuracy, k] = knn.training(features, 2, features.length, 2, true);
		console.log(k);
		let goal = knn.predict(features, [0, 0, 0, 1, 28, 20, 40]);

		console.log(
			'Accuracy about: ' + accuracy + ', was predicted the goal as: ' + goal
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
