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

}


export const stopsController = new StopsController();