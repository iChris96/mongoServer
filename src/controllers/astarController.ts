import { Request, Response } from 'express';
import Stops from '../models/Stops';


class astarController {

    public async getPage(req: Request, res: Response) {
        const stopsListBlue = await Stops.find({ 'properties.lines': "blue" });
        const stopsListRed = await Stops.find({ $and: [{ 'properties.lines': { $ne: "mattapan" } }, { 'properties.lines': "red" }] }); //get red stops except mattapan lines
        const stopsListOrange = await Stops.find({ 'properties.lines': "orange" });
        const stopsListGreen = await Stops.find({ 'properties.lines': "green" });
        res.render('astar/index', { stopsListBlue, stopsListRed, stopsListOrange, stopsListGreen });
    }
    public async algorithm(req: Request, res: Response) {
        let h = 0;
        let g = 0;
        let band = false;
        try {
            let initial = await Stops.findOne({ "properties.id": req.body.initial_station });
            let final = await Stops.findOne({ "properties.id": req.body.final_station });
            if (initial != null && final != null) {
                let actual = initial;
                let opened = [{ "station": actual.properties.id, "f": 0, "father": actual.properties.name }];
                let closed = [];
                while (opened.length > 0) {

                    for (const iterator of actual.properties.childrens) {
                        let child = await Stops.findOne({ "properties.id": iterator.id });
                        if (child != null) {
                            let h = this.calc_distance(child.geometry.coordinates, final.geometry.coordinates);
                            if (closed.filter(close => close.properties.id == child?.properties.id).length == 0) {
                                // if (child.properties.name == "State") {
                                    // console.log("si");

                                    // opened.push({ station: iterator, f: h + g + 1000123123123, father: actual.properties.name });
                                // }
                                // else {
                                    opened.push({ station: iterator.id, f: h + g, father: actual.properties.id });
                                // }

                            }

                        }
                    }
                    opened.sort(function (a, b) {
                        if (a.f < b.f) {
                            return -1;
                        }
                        if (a.f > b.f) {
                            return 1;
                        }
                        return 0;
                    })
                    // console.log(opened);
                    let aux_mejor = opened.shift();
                    if (aux_mejor != undefined) {
                        let mejor = await Stops.findOne({ "properties.id": aux_mejor.station });

                        if (mejor != null) {
                            mejor.properties.father = aux_mejor.father;
                            g += this.calc_distance(actual.geometry.coordinates, mejor.geometry.coordinates);
                            closed.push(actual);
                            actual = mejor;
                        }
                    }
                    if (actual.properties.id == final.properties.id) {
                        band = true;
                        break;
                    }
                }
                if (band) {
                    let father = actual;
                    let recorrido = [father]
                    while (father.properties.id != initial.properties.id) {

                        let aux = closed.filter(close => close.properties.id == father.properties.father);

                        if (aux[0] != undefined) {
                            father = aux[0];
                            recorrido.push(father);
                        }
                    }
                    for (const iterator of recorrido) {
                        console.log("estacion:", [iterator.properties.id]);
                    }
                    res.send("exito");
                }
                else {
                    res.send("pelas");
                }
            }
        } catch (error) {
            console.log(error);

        }

    }

    public calc_min(stations: Array<any>) {
        let to_return = {
            station: "", f: 0
        }
        to_return = stations[0];
        for (const iterator of stations) {
            if (iterator.f < to_return.f) {
                to_return = iterator
            }
        }
        return to_return;
    }
    public calc_distance(initial: Array<any>, final: Array<any>) {
        let initial_lat = initial[1];
        let initial_long = initial[0];
        let final_lat = final[1];
        let final_long = final[0];
        let earth_radius = 6371000;
        initial_lat = initial_lat * (Math.PI / 180);
        initial_long = initial_long * (Math.PI / 180);
        final_lat = final_lat * (Math.PI / 180);
        final_long = final_long * (Math.PI / 180);

        let latitude_delta = initial_lat - final_lat;
        let longitude_delta = initial_long - final_long;

        let angulo = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(latitude_delta / 2), 2) +
            Math.cos(initial_lat) * Math.cos(final_lat) * Math.pow(Math.sin(longitude_delta / 2), 2)));

        const total = angulo * earth_radius;

        return total;

    }
}


export const astar_Controller = new astarController();