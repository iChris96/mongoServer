import { Request, Response } from 'express';
import Stops from '../models/Stops';
import AfluencyStation from '../models/AfluencyStations';
import { knnController } from './knnController';

class astarController {
	public async getPage(req: Request, res: Response) {
		const stopsList = await Stops.find().sort({"properties.name": 1});
		res.render('astar/index', {
			stopsList
		});
	}

	public async simulatorPage(req: Request, res: Response){
		if(req.session)
        {
            const user = req.session.username;
            if(!user){
                res.redirect('/auth/login');
            }
            else{
				const stopsList = await Stops.find().sort({"properties.name": 1});
				res.render('astar/simulator', {
					stopsList, user
				});
            }
        }

	}
	
	public async afluencyPage(req: Request, res: Response){
		if(req.session)
        {
            const user = req.session.username;
            if(!user){
                res.redirect('/auth/login');
            }
            else{
				const stopsList = await Stops.find().sort({"properties.name": 1});
				const actualList = await AfluencyStation.find().sort({"station": 1});
				res.render('astar/saveAfluency', {
					stopsList,
					actualList,
					user
				});
            }
        }

	}
	public async algorithm(req: Request, res: Response) {
		let date = new Date(req.body.date);
		console.log('init: ', req.body.initial_station);
		console.log('final: ', req.body.final_station);

		console.log(
			'date body -> ',
			date.getFullYear(),
			date.getUTCMonth() + 1,
			date.getDate(),
			date.getHours(),
			date.getMinutes()
		); //2020-08-12T00:10:00 -> 12 agosto a las 12:10 am
		//[25, 0.8888800000000055, 15] test
		// console.log('date body -> ', date); //2020-08-12T00:10:00 -> 12 agosto a las 12:10 am

		let h = 0;
		let g = 0;
		let band = false;
		try {
			console.time('loop');
			let initial = await Stops.findOne({
				'properties.id': req.body.initial_station
			});
			let final = await Stops.findOne({
				'properties.id': req.body.final_station
			});
			if (initial != null && final != null) {
				let actual = initial;
				let p_knn = await applyKnn(
					initial.properties.csvName.toString(),
					date.getDate(),
					date.getHours(),
					date.getMinutes()
				);
				let array_p = [{ station: actual.properties.id, knn: p_knn }];
				let opened = [
					{
						station: actual.properties.id,
						f:
							this.calc_distance(
								actual.geometry.coordinates,
								final.geometry.coordinates
							) + p_knn,
						father: actual.properties.name
					}
				];
				let consult = 0;
				let closed = [];
				while (opened.length > 0) {
					opened.sort(function(a, b) {
						return a.f - b.f;
					});
					let aux_mejor = opened.shift();
					if (aux_mejor != undefined) {
						let mejor = await Stops.findOne({
							'properties.id': aux_mejor.station
						});
						if (mejor != null) {
							mejor.properties.father = aux_mejor.father;
							closed.push(mejor);
							g += this.calc_distance(
								actual.geometry.coordinates,
								mejor.geometry.coordinates
							);
							actual = mejor;
						}
					}
					if (actual.properties.id == final.properties.id) {
						band = true;
						break;
					} else {
						for (const iterator of actual.properties.childrens) {
							let child = await Stops.findOne({ 'properties.id': iterator.id });
							if (child != null) {
								if (closed.filter(close => close.properties.id == iterator.id).length == 0 ) {
									if (array_p.findIndex(i => i.station == iterator.id) == -1) {
										p_knn = await applyKnn(
											child.properties.csvName.toString(),
											date.getDate(),
											date.getHours(),
											date.getMinutes()
										);
										array_p.push({ station: child.properties.id, knn: p_knn });
									} else {
										let pos = array_p.findIndex(i => i.station == iterator.id);
										p_knn = array_p[pos].knn;
									}
									h = this.calc_distance(child.geometry.coordinates,final.geometry.coordinates);
									let g_child = this.calc_distance(actual.geometry.coordinates,child.geometry.coordinates);
									opened.push({station: iterator.id,f: h + (g + g_child) + p_knn,father: actual.properties.id});
								}
							}
						}
					}
				}
				if (band) {
					let father = actual;

					let recorrido = [{}];
					let estaciones = [
						{
							station: father.properties.id,
							coordinates: father.geometry.coordinates,
							lines: father.properties.lines
						}
					];
					while (father.properties.id != initial.properties.id) {
						let aux = closed.filter(
							close => close.properties.id == father.properties.father
						);

						if (aux[0] != undefined) {
							let geojson = aux[0].properties.childrens.filter(
								child => child.id == father.properties.id
							);
							father = aux[0];
							estaciones.push({
								station: father.properties.id,
								coordinates: father.geometry.coordinates,
								lines: father.properties.lines
							});
							recorrido.push(geojson[0].geojson);
						}
					}
					console.timeEnd('loop');
					console.log(estaciones.reverse());
					return res.status(200).json({
						polyline: {
							type: 'FeatureCollection',
							features: recorrido
						},
						stops: estaciones.reverse()
					});
				} else {
					res.send('error');
				}
			}
		} catch (error) {
			console.log(error);
		}
	}

	public calc_min(stations: Array<any>) {
		let to_return = {
			station: '',
			f: 0
		};
		to_return = stations[0];
		for (const iterator of stations) {
			if (iterator.f < to_return.f) {
				to_return = iterator;
			}
		}
		return to_return;
	}
	public rad = function(x: number) {
		return (x * Math.PI) / 180;
	};
	public calc_distance(initial: Array<any>, final: Array<any>) {
		let initial_lat = initial[1];
		let initial_long = initial[0];
		let final_lat = final[1];
		let final_long = final[0];

		var R = 6378.137; //Radio de la tierra en km
		var dLat = this.rad(final_lat - initial_lat);
		var dLong = this.rad(final_long - initial_long);
		var a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(this.rad(initial_lat)) *
				Math.cos(this.rad(final_lat)) *
				Math.sin(dLong / 2) *
				Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		return d; //Retorna tres decimales
	}
	public async simulator(req: Request, res: Response) {
		 let sim_stations = await AfluencyStation.find() ;

		let h = 0;
		let g = 0;
		let band = false;
		try {
			let initial = await Stops.findOne({
				'properties.id': req.body.initial_station
			});
			let final = await Stops.findOne({ 'properties.id': req.body.final_station });
			if (initial != null && final != null) {
				let actual = initial;
				let p_knn = 0;
				let opened = [
					{
						station: actual.properties.id,
						f: this.calc_distance(
							actual.geometry.coordinates,
							final.geometry.coordinates
						) + p_knn,
						father: actual.properties.name
					}
				];
				let closed = [];
				while (opened.length > 0) {
					opened.sort(function (a, b) {
						return a.f - b.f;
					});
					let aux_mejor = opened.shift();
					if (aux_mejor != undefined) {
						let mejor = await Stops.findOne({ 'properties.id': aux_mejor.station });
						if (mejor != null) {
							mejor.properties.father = aux_mejor.father;
							closed.push(mejor);
							g += this.calc_distance(
								actual.geometry.coordinates,
								mejor.geometry.coordinates
							);
							actual = mejor;
						}
					}
					if (actual.properties.id == final.properties.id) {
						band = true;
						break;
					} else {
						
						for (const iterator of actual.properties.childrens) {
							let child = await Stops.findOne({ 'properties.id': iterator.id });
							if (child != null) {
								if (closed.filter(close => close.properties.id == iterator.id).length == 0) {
									if(sim_stations.findIndex(i => i.station == iterator.id)!= -1){
										let pos = sim_stations.findIndex(i => i.station == iterator.id);
										p_knn = sim_stations[pos].afluency;
									}
									else{
										p_knn = 0;
									}
									let g_child = this.calc_distance(actual.geometry.coordinates,child.geometry.coordinates);
									h = this.calc_distance(child.geometry.coordinates,final.geometry.coordinates);
									opened.push({station: iterator.id,f:h + g + g_child+ p_knn,father: actual.properties.id});
								}
							}
						}
					}
				}
				if (band) {
					let father = actual;

					let recorrido = [{}];
					let estaciones = [
						{
							station: father.properties.id,
							coordinates: father.geometry.coordinates,
							lines: father.properties.lines
						}
					];
					while (father.properties.id != initial.properties.id) {
						let aux = closed.filter(close => close.properties.id == father.properties.father);
						if (aux[0] != undefined) {
							let geojson = aux[0].properties.childrens.filter(child => child.id == father.properties.id);
							father = aux[0];
							estaciones.push({
								station: father.properties.id,
								coordinates: father.geometry.coordinates,
								lines: father.properties.lines
							});
							recorrido.push(geojson[0].geojson);
						}
					}
					console.log(estaciones.reverse());
					return res.status(200).json({
						polyline: {
							type: 'FeatureCollection',
							features: recorrido
						},
						stops: estaciones.reverse()
					});
				} else {
					res.send('pelas');
				}
			}
		} catch (error) {
			console.log(error);
		}
	}
	public async saveAfluency(req: Request, res: Response){
		console.log(req.body);
		
		let sim_stations = [] ;
	
		const station = req.body.station;
		const afluency = (req.body.weight);
		if(Array.isArray(station)){
			for (let index = 0; index < station.length; index++) {
				const element = station[index];
				const peso = afluency[index];
				sim_stations.push({station: element, afluency:peso});
			}
		}
		else{
			sim_stations.push({station: station, afluency: afluency});
		}
		console.log(sim_stations);
		
		for (const iterator of sim_stations) {
			await AfluencyStation.update(
				{"station": iterator.station},
				{
					station: iterator.station,
					afluency: iterator.afluency
				},
				{ upsert: true }
			)
		}


		res.redirect('/saveAfluency');

	}

	public async deleteAfluency(req:Request,res:Response){
		await AfluencyStation.remove({});
		res.redirect('/saveAfluency');
	}

	
}

async function applyKnn(
	station: string,
	day: number,
	hours: number,
	minutes: number
) {
	console.log(station);

	const prediction = await knnController.applyKnnWithKnowStation(
		station,
		day,
		hours,
		minutes
	);
	return prediction;
}



export const astar_Controller = new astarController();
