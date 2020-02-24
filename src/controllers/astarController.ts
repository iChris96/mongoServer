import { Request, Response } from 'express';
import Stops from '../models/Stops';

class astarController {
	public async getPage(req: Request, res: Response) {
		const stopsListBlue = await Stops.find({ 'properties.lines': 'blue' });
		const stopsListRed = await Stops.find({ 'properties.lines': 'red' }); //get red stops except mattapan lines
		const stopsListOrange = await Stops.find({ 'properties.lines': 'orange' });
		const stopsListGreen = await Stops.find({ 'properties.lines': 'green' });
		res.render('astar/index', {
			stopsListBlue,
			stopsListRed,
			stopsListOrange,
			stopsListGreen
		});
	}
	public async algorithm(req: Request, res: Response) {
		let h = 0;
		let g = 0;
		let band = false;
		try {
			let initial = await Stops.findOne({
				'properties.id': req.body.initial_station
			});
			let final = await Stops.findOne({
				'properties.id': req.body.final_station
			});
			if (initial != null && final != null) {
				let actual = initial;
				let opened = [
					{
						station: actual.properties.id,
						f: this.calc_distance(
							actual.geometry.coordinates,
							final.geometry.coordinates
						),
						father: actual.properties.name
					}
				];
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
								initial.geometry.coordinates,
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
								let h = this.calc_distance(
									child.geometry.coordinates,
									final.geometry.coordinates
								);
								if (
									closed.filter(close => close.properties.id == iterator.id)
										.length == 0
								) {
									opened.push({
										station: iterator.id,
										f: h + g,
										father: actual.properties.id
									});
								}
							}
						}
					}
				}
				console.log(actual);
				if (band) {
					let father = actual;

					let recorrido = [{}];
						let estaciones = [{}];
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
									estacion: father.properties.id,
									coordinates: father.geometry.coordinates
								});
								recorrido.push(geojson[0].geojson);
							}
						console.log(estaciones);

						return res.status(200).json({
							polyline: {
								type: 'FeatureCollection',
								features: recorrido
							},
							stops: estaciones.reverse()
						});
					}
				} else {
					res.send('pelas');
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
}

export const astar_Controller = new astarController();
