import { Router } from 'express';
import { knnController } from '../controllers/knnController';

const router = Router();

//GET TASKS AS JSON
router.route('/').get(knnController.test);

router.route('/2').get(knnController.test2);

router.route('/byStation').post(knnController.knnByStation);

router.route('/testWithRandom').get(knnController.testWithRandom);

export default router;
