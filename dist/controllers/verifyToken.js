"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('auth-token'); //pass token as x-access-token header value
    if (!token) {
        return res.status(401).json({
            auth: false,
            message: 'No token provided'
        });
    }
    console.log('token from headers received: ', token);
    const decoded = yield jsonwebtoken_1.default.verify(token, config_1.default.secret || 'sometoken');
    console.log('decoded token: ', decoded);
    console.log('decoded id: ', decoded.id);
    //console.log('decoded id123: ', (decoded as IPayload).iat);
    //console.log('decoded id123: ', decoded.exp);
    req.userId = decoded.id;
    console.log('the req as any = ', req.userId);
    next();
});
//# sourceMappingURL=verifyToken.js.map