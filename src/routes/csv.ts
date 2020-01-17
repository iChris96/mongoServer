import { Router, Request, Response } from 'express'
import { csvController } from '../controllers/csvController'

const router = Router();
router.route('/create')
    .get(
        csvController.createCsvGet
        )
        .post(
        csvController.createCsvPost
    );

    export default router;