import { Router, Request, Response } from 'express'
import { stopsController } from '../controllers/stopsController'

const router = Router();

// Models
import Stops from "../models/Stops";

//GET TASKS AS JSON
router.route('/blue')
    .get(
        stopsController.getBlueStops
    );

router.route('/red')
    .get(
        stopsController.getRedStops
    );

router.route('/orange')
    .get(
        stopsController.getOrangeStops
    );

export default router;