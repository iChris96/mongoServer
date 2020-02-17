import { Request, Response, NextFunction } from 'express';

// Models
import Stops from '../models/Stops';


class StopsController{

     //Get blue stops
     public async getBlueStops (req: Request, res: Response) {
        const stopsList = await Stops.find({ 'properties.lines': "blue" });
        //console.log(stopsList);
        return res.status(200).json({
            stopsList: stopsList
        });
    }

    //Get red stops
    public async getRedStops (req: Request, res: Response) {
        const stopsList = await Stops.find({ $and: [ {'properties.lines': { $ne: "mattapan" }}, {'properties.lines': "red"}]}); //get red stops except mattapan lines
        //console.log(stopsList);
        return res.status(200).json({
            stopsList: stopsList
        });
    }

    //Get orange stops
    public async getOrangeStops (req: Request, res: Response) {
        const stopsList = await Stops.find({ 'properties.lines': "orange" });
        //console.log(stopsList);
        return res.status(200).json({
            stopsList: stopsList
        });
    }

    //Get all stops
    public async getAllStops (req: Request, res: Response) {
        const stopsList = await Stops.find({ $or: [{ $and: [ {'properties.lines': { $ne: "mattapan" }}, {'properties.lines': "red"}]},{ 'properties.lines': "orange" },{ 'properties.lines': "blue" }]});
        //console.log(stopsList);
        return res.status(200).json({
            stopsList: stopsList
        });
    }

     //Get orange coordinates
     public async getOrangeCoordinates (req: Request, res: Response) {
        const stopsList = await Stops.find({ 'properties.lines': "orange" });
        //console.log(stopsList);
        const response = [{}]
        stopsList.forEach(stop => {
            response.push({
                "type": "Feature",
                "properties": {
                    "name": stop.properties.name
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": stop.geometry.coordinates
                }
            })
        });
        return res.status(200).json({
            stopsList: response
        });
    }

    //Get blue coordinates
    public async getBlueCoordinates(req: Request, res: Response) {
        const stopsList = await Stops.find({ 'properties.lines': "blue" });
        //console.log(stopsList);
        const response = [{}]
        stopsList.forEach(stop => {
            response.push({
                "type": "Feature",
                "properties": {
                    "name": stop.properties.name
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": stop.geometry.coordinates
                }
            })
        });
        return res.status(200).json({
            stopsList: response
        });
    }

    public async getRedCoordinates(req: Request, res: Response) {
        const stopsList = await Stops.find({ $and: [ {'properties.lines': { $ne: "mattapan" }}, {'properties.lines': "red"}]}); //get red stops except mattapan lines
        //console.log(stopsList);
        const response = [{}]
        stopsList.forEach(stop => {
            response.push({
                "type": "Feature",
                "properties": {
                    "name": stop.properties.name
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": stop.geometry.coordinates
                }
            })
        });
        return res.status(200).json({
            stopsList: response
        });
    }

    //Get some polyline
    public async getSomePolyline (req: Request, res: Response) {
        return res.status(200).json({
            polyline: {
                "type": "FeatureCollection",
                "features": [
                    {
                        "geometry": {
                            "type": "LineString",
                            "coordinates": [
                                [
                                    -71.107125,
                                    42.310359
                                  ],
                                  [
                                    -71.113377,
                                    42.300023
                                  ]
                            ]
                        },
                        "type": "Feature",
                        "properties": {
                            "directions": [
                                "N",
                                "S"
                            ],
                            "id": "orange",
                            "name": "Orange Line"
                        }
                    }
                ]
            }
        });
    }
}


export const stopsController = new StopsController();