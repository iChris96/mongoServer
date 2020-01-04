"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
// Models
const json_1 = __importDefault(require("../models/json"));
class JsonController {
    createJsonGet(req, res) {
        res.render('json/create');
    }
    createJsonPost(req, res) {
        //file es el archivo que subimos desde el formulario
        try {
            const data = fs_1.default.readFileSync(req.file.path, 'utf8');
            let docs = JSON.parse(data);
            json_1.default.insertMany(docs); //Insertamos en la base de datos
        }
        catch (err) {
            console.error(err);
        }
        res.redirect('/');
    }
}
exports.jsonController = new JsonController();
