import { Router} from 'express'
import { stopsController } from '../controllers/stopsController'

const router = Router();

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

router.route('/all')
.get(
    stopsController.getAllStops
);

export default router;