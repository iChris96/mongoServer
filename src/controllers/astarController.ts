import { Request, Response } from 'express';
import fs from 'fs';
import Stops from '../models/Stops';


class astarController {

    public async getPage(req: Request, res: Response) {
        const stopsListBlue = await Stops.find({ 'properties.lines': "blue" });
        const stopsListRed = await Stops.find({ $and: [{ 'properties.lines': { $ne: "mattapan" } }, { 'properties.lines': "red" }] }); //get red stops except mattapan lines
        const stopsListOrange = await Stops.find({ 'properties.lines': "orange" });

        res.render('astar/index', { stopsListBlue, stopsListRed, stopsListOrange });
    }
    public async algorithm(req: Request, res: Response) {
        let h = 0;
        let g = 0;
        try {
            let initial = await Stops.findById({ _id: req.body.initial_station });
            let final = await Stops.findById({ _id: req.body.final_station });
            if (initial != null && final != null) {
                let actual = initial;
                let visited = [initial];
                while( final.properties.name != actual.properties.name){
                    let distance = [];
                    for (const iterator of actual.properties.childrens) {
                      let child = await Stops.findOne({"properties.name": iterator});
                      
                        if(child != null)
                        {
                            let h = this.calc_distance(child.geometry.coordinates, final.geometry.coordinates);
                            distance.push({station: iterator, f: h+g});
                        } 
                    } 
                    let mejor = await Stops.findOne({"properties.name": this.calc_min(distance).station});
                    if(mejor != null){
                        g = this.calc_distance(actual.geometry.coordinates, mejor.geometry.coordinates);
                        actual = mejor;
                        visited.push(actual);
                    }
                }
                for (const iterator of visited) {
                    console.log({"recorrido":iterator.properties.name});
                }
                res.send("ok")
            }
        } catch (error) {
            console.log(error);
            
        }

    }

    public calc_min(stations: Array<any>){
        let to_return = {
            station: "", f: 0
        }
        to_return = stations[0];
        for (const iterator of stations) {
            if(iterator.f < to_return.f)
            {
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
        initial_lat = initial_lat * (Math.PI/180);
        initial_long = initial_long * (Math.PI/180);
        final_lat = final_lat * (Math.PI/180);
        final_long = final_long * (Math.PI/180);

        let latitude_delta = initial_lat - final_lat;
        let longitude_delta = initial_long - final_long;

        let angulo = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(latitude_delta / 2), 2) + 
        Math.cos (initial_lat) * Math.cos(final_lat) * Math.pow(Math.sin(longitude_delta /2), 2)));

        const total = angulo * earth_radius;

        return total;

    }
}


export const astar_Controller = new astarController();