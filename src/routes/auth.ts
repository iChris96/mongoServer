import { Router} from 'express'
import { authController } from '../controllers/authController'
import { verifyToken } from '../controllers/verifyToken'

const router = Router();

//register
router.route('/signup')
    .get(
        authController.signup 
    );

//login
router.route('/signin')
    .post(
        authController.signin
    );

//get user info by token
router.route('/me')
    .all(
        verifyToken
    ).get(
        authController.me
    )


export default router;