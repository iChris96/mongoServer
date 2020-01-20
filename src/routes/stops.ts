import { Router, Request, Response } from 'express'


const router = Router();

// Models
import Stops from "../models/Stops";

//GET TASKS AS JSON
router.route('/blue')
        .get(
            async (req: Request, res: Response) => {
                const stopsList = await Stops.findOne();
                console.log(stopsList);
                return res.status(200).json(stopsList);
            }
        );

export default router;