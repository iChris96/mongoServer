import { Router} from 'express'
import { authController } from '../controllers/authController'
import { verifyToken } from '../controllers/verifyToken'

const router = Router();

//register
router.route('/signup')
    .post(
        authController.signup 
    );

//login
router.route('/signin')
    .post(
        authController.signin
    );

//refreshToken
router.route('/refreshToken')
    .post(
        authController.refreshToken
    );

//get user info by token
router.route('/me')
    .all(
        verifyToken
    ).get(
        authController.me
    )

router.route('/login')
.get(
    authController.login
)
.post(
    authController.auth
)

router.route('/logout')
.get(
    authController.logout
)
export default router;