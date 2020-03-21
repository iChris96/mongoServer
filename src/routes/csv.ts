import { Router, Request, Response } from 'express';
import { csvController } from '../controllers/csvController';

const router = Router();
router
	.route('/create')
	.get(csvController.createCsvGet)
	.post(csvController.createCsvPost);

router.route('/make').get(csvController.resetRandomEntries);

export default router;
