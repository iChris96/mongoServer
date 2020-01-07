"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const verifyToken_1 = require("../controllers/verifyToken");
const router = express_1.Router();
//register
router.route('/signup')
    .post(authController_1.authController.signup);
//login
router.route('/signin')
    .post(authController_1.authController.signin);
//get user info by token
router.route('/me')
    .all(verifyToken_1.verifyToken).get(authController_1.authController.me);
exports.default = router;
//# sourceMappingURL=auth.js.map