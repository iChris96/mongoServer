import { Router, Request, Response } from 'express'
import { jsonController } from '../controllers/jsonController'

const router = Router();
router.route('/create')
    .get(
        jsonController.createJsonGet)
        .post(
            jsonController.createJsonPost
        );

    export default router;