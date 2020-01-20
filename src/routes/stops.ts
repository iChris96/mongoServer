import { Router, Request, Response } from 'express'


const router = Router();

// Models
import Stops from "../models/Stops";

//GET TASKS AS JSON
router.route('/blue')
    .get(
        async (req: Request, res: Response) => {
            const stopsList = await Stops.find({ 'properties.lines': "blue" });
            console.log(stopsList);
            return res.status(200).json(stopsList);
        }
    );

router.route('/red')
    .get(
        async (req: Request, res: Response) => {
            const stopsList = await Stops.find({ 'properties.lines': "red" });
            console.log(stopsList);
            return res.status(200).json(stopsList);
        }
    );

router.route('/orange')
    .get(
        async (req: Request, res: Response) => {
            const stopsList = await Stops.find({ 'properties.lines': "orange" });
            console.log(stopsList);
            return res.status(200).json(stopsList);
        }
    );

export default router;