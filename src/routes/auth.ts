import { Router} from 'express'
import { authController } from '../controllers/authController'


const router = Router();


router.route('/signin')
    .get(
        authController.signin
    );

router.route('/signup')
    .get(
        authController.signup 
    );

router.route('/me')
    .get(
        authController.me
    );



export default router;