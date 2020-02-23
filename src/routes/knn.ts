import { Router } from 'express';
import { knnController } from '../controllers/knnController';

const router = Router();

//GET TASKS AS JSON
router.route('/').get(knnController.test);

export default router;
