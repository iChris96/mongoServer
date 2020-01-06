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
const jwt = require('jsonwebtoken');
// Models
const User_1 = __importDefault(require("../models/User"));
class AuthController {
    //Register
    signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userName, email, password } = req.body; //get data from body
            const user = new User_1.default({
                userName: userName,
                email: email,
                password: password
            });
            user.password = yield user.encryptPassword(user.password); //apply encrypt password to userSchema 
            console.log(user);
            yield user.save(); //save user to db
            //create token
            const token = jwt.sign({ id: user._id }, config_1.default.secret, {
                expiresIn: 60 * 60 * 24 //1 dia
            });
            console.log('Token created: ', token);
            res.header('auth-token', token).json({
                message: 'User Save',
                token: token
            });
        });
    }
    //Start Session
    signin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            //get user data from db
            const { email, password } = req.body;
            const user = yield User_1.default.findOne({ email: email }); //find user by email
            if (!user) {
                return res.status(404).send({
                    auth: false,
                    message: "Email doesn't exists"
                });
            }
            //validate provided password
            const validPassword = yield user.validatePassword(password); //true if password is valid
            console.log(validPassword);
            if (!validPassword) {
                return res.status(401).send({
                    auth: false,
                    message: "incorrect data"
                });
            }
            //create token
            const token = jwt.sign({ id: user._id }, config_1.default.secret, {
                expiresIn: 60 * 60 * 24 //1 dia
            });
            console.log(token);
            //return token + response
            res.header('auth-token', token).json({
                auth: true,
                token: token
            });
        });
    }
    //Get user info by token
    me(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            /*const user = await User.findById('token123', { password: 0 }); //get user by req.userId (witch is provide for verifyToken middleware) from db except password value
            if(!user){
                return res.status(404).send('Not user found');
            }*/
            res.json({
                message: 'user found',
            });
        });
    }
}
exports.authController = new AuthController();
//# sourceMappingURL=authController.js.map