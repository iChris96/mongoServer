import { Request, Response } from 'express';
const KNN = require('@artificialscience/k-nn');
const nn = require('nearest-neighbor');
import EntriesKNN, { IEntriesKnn } from '../models/EntriesKNN';

export interface IKnnRequest extends Request {
	station: string; // or any other type
	data: IData;
}

export interface IData {
	day: number;
	minutes: number;
	hours: number;
}

class KnnController {
	public async test(req: Request, res: Response) {
		/*let entries = await EntriesKNN.find(
			{ station: 'Andrew Square' }
        );*/

		//CALL ENTRIES BY STATION
		let entries = await EntriesKNN.find(
			{ station: 'Andrew Square' },
			'-_id day hour minutes entries',
			function(err, entity) {
				//console.log(entity); // { field1: '...', field2: '...' }
			}
		);
		/*let entries = await EntriesKNN.aggregate([
			{
				$project: {
					_id: 0,
					day: 1,
					hour: 1,
					minutes: 1,
					entries: 1
				}
			}
		]);*/

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

		/*
            [ [ 1, 4, 32, 1 ],
            [1]   [ 1, 4, 34, 0 ],
            [1]   [ 1, 5, 10, 2 ],
            [1]   [ 1, 5, 11, 1 ],
            [1]   [ 1, 5, 12, 1 ],
            [1]   [ 1, 5, 13, 1 ],
            [1]   [ 1, 5, 14, 1 ],
            [1]   [ 1, 5, 19, 2 ],
            [1]   [ 1, 5, 17, 1 ],
            [1]   [ 1, 5, 20, 2 ],
            [1]   [ 1, 5, 22, 1 ],
            [1]   [ 1, 5, 23, 10 ],
            [1]   [ 1, 5, 24, 3 ],
            [1]   [ 1, 5, 25, 5 ],
            [1]   [ 1, 5, 26, 2 ] ]
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
		const knn = new KNN(3, 3, euclidian);

		//outpts, testSize, shuffleTimes, ktimes, normalize
		let [accuracy, k] = knn.training(features, 2, features.length, 2, false);
		let goal = knn.predict(features, [1, 5, 23]);

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

	public async knnByStation(req: Request, res: Response) {
		const stationReq: string = req.body.station;
		const instanceToPrediceReq: Array<Number> = [
			req.body.data.day,
			req.body.data.hours,
			req.body.data.minutes
		];
		console.log(stationReq);
		console.log(instanceToPrediceReq);

		//CALL ENTRIES BY STATION
		let entries = await EntriesKNN.find(
			{ station: stationReq },
			'-_id day hour minutes entries',
			function(err, entity) {}
		);

		//Test -> Uncomment to only use n instances
		entries = entries.slice(0, 15);
		console.log('entries lenght:', entries.length);

		//Entries to Features
		let features: Array<Array<Number>> = entries.map(item => {
			//console.log(item);
			//console.log(Object.values(item.toObject()));
			return [item.day, item.hour, item.minutes, item.entries];
		});

		//Test-> Uncomment to show all features
		console.log('Show features:', features);

		//Define customDistanceFunction
		const euclidian = (a: Array<number>, b: Array<number>) => {
			return (
				a
					.map((euclidian, i) => Math.abs(euclidian - b[i]) ** 2) // square the difference
					.reduce((sum, now) => sum + now) ** // sum
				(1 / 2)
			);
		};

		//Set Knn -> dimension, goalIndex, customDistanceFunction, customGoalFunction
		const knn = new KNN(3, 3, euclidian);

		//set Training -> outpts, testSize, shuffleTimes, ktimes, normalize
		let [accuracy, k] = knn.training(features, 2, features.length, 2, false);

		//set Goal ->
		let goal = knn.predict(features, instanceToPrediceReq);

		console.log(
			'Accuracy about: ' +
				accuracy +
				', k: ' +
				k +
				', was predicted the goal as: ' +
				goal
		);

		res.status(200).send({ entries: goal });
	}

	public async testWithRandom(req: Request, res: Response) {
		const stationReq: string = 'Airport';
		const instanceToPrediceReq: Array<Number> = [20, 16, 11];
		console.log(
			'Intance to find, Station:',
			stationReq,
			'data',
			instanceToPrediceReq
		);
		const allStopsNames = [
			'Airport',
			'Alewife',
			'Andrew Square',
			'Aquarium',
			'Ashmont',
			'Back Bay',
			'Beachmont',
			'Bowdoin',
			'Boylston',
			'Braintree',
			'Broadway',
			'Central Square',
			'Charles/MGH',
			'Chinatown',
			'Community College',
			'Davis Square',
			'Downtown Crossing',
			'Fields Corner',
			'Forest Hills',
			'Government Center',
			'Green Street',
			'Harvard',
			'Haymarket',
			'Jackson Square',
			'JFK/U Mass',
			'Kendall Square',
			'Malden',
			'Massachusetts Ave.',
			'Maverick',
			'North Quincy',
			'North Station',
			'Oak Grove',
			'Orient Heights',
			'Park Street',
			'Porter Square',
			'Quincy Adams',
			'Quincy Center',
			'Revere Beach',
			'Roxbury Crossing',
			'Ruggles',
			'Savin Hill',
			'Shawmut',
			'South Station',
			'State Street',
			'Stony Brook',
			'Suffolk Downs',
			'Sullivan Square',
			'Tufts Medical Center',
			'Wellington',
			'Wollaston',
			'Wonderland',
			'Wood Island'
		];

		//MAKING INSTANCE TO PREDICE ENTRIES WITH KNN
		let preArray: Array<Number> = allStopsNames.map((name, index) => {
			return name === stationReq ? 1 : 0;
		});
		//console.log(preArray);
		let instance = preArray.concat(instanceToPrediceReq);
		//console.log('Intance find: ', instance);
		//console.log('Intance size:', instance.length);

		//CALL RANDOM ENTRIES FROM DB
		let entries = await EntriesKNN.aggregate([{ $sample: { size: 500 } }]);
		//console.log('entries:', entries);

		//INSERT STATION ARRAY [0],[0],[0]... INTO EVERY FEATURE
		let features: Array<Array<Number>> = entries.map(item => {
			//console.log(item);
			//console.log(Object.values(item.toObject()));
			let preArray: Array<Number> = [];

			allStopsNames.forEach(it => {
				if (item.station === it) {
					preArray.push(1);
				} else {
					preArray.push(0);
				}
			});
			console.log(
				'station:',
				item.station,
				'    day:',
				item.day,
				'    hour:',
				item.hour,
				'    minutes:',
				item.minutes,
				'           -> entries:',
				item.entries
			);

			return preArray.concat([item.day, item.hour, item.minutes, item.entries]);
		});

		//UNCOMENT TO TESTING -> pushing static's features into features for testing purpose
		/*
		// prettier-ignore
		features.push([ 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,16,5,2 ]);
		// prettier-ignore
		features.push([ 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,16,7,4 ]);
		// prettier-ignore
		features.push([ 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,16,9,6]);
		*/

		//console.log('features:', features);
		//console.log('features size: ', features.length);

		//DEFINE CUSTOM DISTANCE FUNCTION
		const euclidian = (a: Array<number>, b: Array<number>) => {
			return (
				a
					.map((euclidian, i) => Math.abs(euclidian - b[i]) ** 2) // square the difference
					.reduce((sum, now) => sum + now) ** // sum
				(1 / 2)
			);
		};

		//Set Knn -> dimension, goalIndex, customDistanceFunction, customGoalFunction
		const knn = new KNN(55, 55, euclidian);

		//set Training -> outpts, testSize, shuffleTimes, ktimes, normalize
		let [accuracy, k] = knn.training(
			features,
			features.length,
			features.length,
			3,
			true
		);

		//set Goal ->
		let goal = knn.predict(features, instance);

		console.log(
			'Accuracy about: ' +
				accuracy +
				', k: ' +
				k +
				', was predicted the goal as: ' +
				goal
		);

		res.status(200).send({ entries: goal });
	}

	public async testTryToRegression(req: Request, res: Response) {
		const features = [
			[48, 0.5158030616769878, 16, 2],
			[83, 0.5262942735596369, 16, 6],
			[21, 0.8888800000000051, 11, 11],
			[23, 0.8888800000000053, 13, 13],
			[25, 0.8888800000000055, 15, 15],
			[80, 0.5362942735596369, 16, 6],
			[97, 0.5281527464327415, 16, 5],
			[98, 0.5148717143151224, 16, 5]
		];
		//dimension, goalIndex, customDistanceFunction, customGoalFunction
		const knn = new KNN(3);

		//outpts, testSize, shuffleTimes, ktimes, normalize
		//let [accuracy, k] = knn.training(features, 2, features.length, 8, false);
		let [accuracy, k] = [0, 0]; //IGNORE, TESTING PURPOSES
		knn.setK(3); //custom BEST K
		let goal = knn.predict(features, [20, 0.8888800000000055, 13]);
		console.log(
			'BEST K: ' +
				k +
				' Accuracy about: ' +
				accuracy +
				', was predicted the goal as: ' +
				goal
		);

		res.status(200).send({ goal: goal, accuracy: accuracy, k: k });
	}
}

/*
	-knn.training -> si lo comentas solo afecta el k, como si fuera buscando el mejor k para la hora de predecir.
	-knn.predice  -> actualPoints es un array de distancia,goal del tamaño de los features, despues los ordena de
		mayor a menor y selecciona los k primeros y hace unas validaciones para regresar frequency final

*/

export const knnController = new KnnController();
