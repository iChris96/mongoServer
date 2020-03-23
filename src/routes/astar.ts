import { Router, Request, Response } from 'express'
import { astar_Controller } from '../controllers/astarController'


const router = Router();

router.route('/astar')
    .get(
        astar_Controller.getPage
    )
    .post(
        astar_Controller.algorithm.bind(astar_Controller)
    )
router.route('/simulator')
        .get(astar_Controller.simulatorPage)
        .post(astar_Controller.simulator.bind(astar_Controller))

router.route('/saveAfluency')
        .get(astar_Controller.afluencyPage)
        .post(astar_Controller.saveAfluency.bind(astar_Controller))

router.route('/resetAfluency')
        .get(astar_Controller.deleteAfluency)
export default router;