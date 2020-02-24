import { Request, Response } from 'express';
const KNN = require('@artificialscience/k-nn');

interface instancia {
	x: number;
	y: number;
	z: number;
}

class KnnController {
	public test(req: Request, res: Response) {
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

		const features = [
			[10, 10, 10, 10, 0.5, 16, 5],
			[10, 10, 10, 10, 0.9, 16, 5],
			[10, 10, 10, 10, 0.8, 16, 40],
			[10, 10, 10, 10, 0.6, 16, 12],
			[10, 10, 10, 10, 0.9, 16, 8],
			[14, 14, 14, 14, 0.9, 14, 80],
			[10, 10, 10, 10, 0.11, 16, 4],
			[10, 10, 10, 10, 0.7, 16, 9]
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
		const knn = new KNN(6, 6, x);
		//outpts, testSize, shuffleTimes, ktimes, normalize
		let [accuracy, k] = knn.training(features, 1, features.length, 4, false);
		console.log(k);
		let goal = knn.predict(features, [14, 14, 14, 14, 0.9, 14]);

		console.log(
			'Accuracy about: ' + accuracy + ', was predicted the goal as: ' + goal
		);

		res.json({ amazing: 'amazing' });
	}
}

export const knnController = new KnnController();
