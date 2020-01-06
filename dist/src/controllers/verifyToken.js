"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.verifyToken = (req, res, next) => {
    const token = req.header('auth-token'); //pass token as x-access-token header value
    if (!token) {
        return res.status(401).json({
            auth: false,
            message: 'No token provided'
        });
    }
    console.log('token from headers received: ', token);
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.secret || 'sometoken');
    console.log('decoded token: ', decoded);
    req.userId = decoded._id;
    next();
};
//# sourceMappingURL=verifyToken.js.map