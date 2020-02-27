import { Request, Response, NextFunction } from 'express';

// Models
import Stops from '../models/Stops';

class StopsController {
	//Get blue stops
	public async getBlueStops(req: Request, res: Response) {
		const stopsList = await Stops.find({ 'properties.lines': 'blue' });
		//console.log(stopsList);
		return res.status(200).json({
			stopsList: stopsList
		});
	}

	//Get red stops
	public async getRedStops(req: Request, res: Response) {
		const stopsList = await Stops.find({
			$and: [
				{ 'properties.lines': { $ne: 'mattapan' } },
				{ 'properties.lines': 'red' }
			]
		}); //get red stops except mattapan lines
		//console.log(stopsList);
		return res.status(200).json({
			stopsList: stopsList
		});
	}

	//Get orange stops
	public async getOrangeStops(req: Request, res: Response) {
		const stopsList = await Stops.find({ 'properties.lines': 'orange' });
		//console.log(stopsList);
		return res.status(200).json({
			stopsList: stopsList
		});
	}

	//Get green stops
	public async getGreenStops(req: Request, res: Response) {
		const stopsList = await Stops.find({ 'properties.lines': 'green' });
		//console.log(stopsList);
		return res.status(200).json({
			stopsList: stopsList
		});
	}

	//Get all stops
	public async getAllStops(req: Request, res: Response) {
		const stopsList = await Stops.find({
			$or: [
				{
					$and: [
						{ 'properties.lines': { $ne: 'mattapan' } },
						{ 'properties.lines': 'red' }
					]
				},
				{ 'properties.lines': 'orange' },
				{ 'properties.lines': 'blue' },
				{ 'properties.lines': 'green' }
			]
		});
		const orderList = [...stopsList].sort((first, second) =>
			String(first.properties.name).localeCompare(
				String(second.properties.name)
			)
		);
		return res.status(200).json({
			stopsList: orderList
		});
	}

	//Properties.name
	public async getAllStopsNames(req: Request, res: Response) {
		const stopsList = await Stops.find({
			$or: [
				{
					$and: [
						{ 'properties.lines': { $ne: 'mattapan' } },
						{ 'properties.lines': 'red' }
					]
				},
				{ 'properties.lines': 'orange' },
				{ 'properties.lines': 'blue' },
				{ 'properties.lines': 'green' }
			]
		});
		let orderList = [...stopsList].sort((first, second) =>
			String(first.properties.name).localeCompare(
				String(second.properties.name)
			)
		);
		let nameList = orderList.map(item => {
			return item.properties.name;
		});
		return res.status(200).json({
			stopsList: nameList
		});
	}

	//Csv Names
	public async getAllStopsCsvNames(req: Request, res: Response) {
		const stopsList = await Stops.find({
			$or: [
				{
					$and: [
						{ 'properties.lines': { $ne: 'mattapan' } },
						{ 'properties.lines': 'red' }
					]
				},
				{ 'properties.lines': 'orange' },
				{ 'properties.lines': 'blue' },
				{ 'properties.lines': 'green' }
			]
		});
		let orderList = [...stopsList].sort((first, second) =>
			String(first.properties.name).localeCompare(
				String(second.properties.name)
			)
		);
		let nameList = orderList.map(item => {
			return item.properties.csvName;
		});
		return res.status(200).json({
			stopsList: nameList
		});
	}

	//Get orange coordinates
	public async getOrangeCoordinates(req: Request, res: Response) {
		const stopsList = await Stops.find({ 'properties.lines': 'orange' });
		//console.log(stopsList);
		const response = [{}];
		stopsList.forEach(stop => {
			response.push({
				type: 'Feature',
				properties: {
					name: stop.properties.name
				},
				geometry: {
					type: 'Point',
					coordinates: stop.geometry.coordinates
				}
			});
		});
		return res.status(200).json({
			stopsList: response
		});
	}

	//Get blue coordinates
	public async getBlueCoordinates(req: Request, res: Response) {
		const stopsList = await Stops.find({ 'properties.lines': 'blue' });
		//console.log(stopsList);
		const response = [{}];
		stopsList.forEach(stop => {
			response.push({
				type: 'Feature',
				properties: {
					name: stop.properties.name
				},
				geometry: {
					type: 'Point',
					coordinates: stop.geometry.coordinates
				}
			});
		});
		return res.status(200).json({
			stopsList: response
		});
	}

	public async getRedCoordinates(req: Request, res: Response) {
		const stopsList = await Stops.find({
			$and: [
				{ 'properties.lines': { $ne: 'mattapan' } },
				{ 'properties.lines': 'red' }
			]
		}); //get red stops except mattapan lines
		//console.log(stopsList);
		const response = [{}];
		stopsList.forEach(stop => {
			response.push({
				type: 'Feature',
				properties: {
					name: stop.properties.name
				},
				geometry: {
					type: 'Point',
					coordinates: stop.geometry.coordinates
				}
			});
		});
		return res.status(200).json({
			stopsList: response
		});
	}

	//Get some polyline
	public async getSomePolyline(req: Request, res: Response) {
		return res.status(200).json({
			polyline: {
				type: 'FeatureCollection',
				features: [
					{
						geometry: {
							type: 'LineString',
							coordinates: [[-71.059195, 42.359868], [-71.062129, 42.361457]]
						},
						type: 'Feature',
						properties: {
							directions: ['N', 'S'],
							id: 'blue',
							name: 'Blue Line'
						}
					},
					{
						geometry: {
							type: 'LineString',
							coordinates: [[-71.057421, 42.359065], [-71.059195, 42.359868]]
						},
						type: 'Feature',
						properties: {
							directions: ['N', 'S'],
							id: 'blue',
							name: 'Blue Line'
						}
					},
					{
						geometry: {
							type: 'LineString',
							coordinates: [[-71.051807, 42.359634], [-71.057421, 42.359065]]
						},
						type: 'Feature',
						properties: {
							directions: ['N', 'S'],
							id: 'blue',
							name: 'Blue Line'
						}
					}
				]
			}
		});
	}
}

export const stopsController = new StopsController();
