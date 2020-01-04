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
// Models
const Task_1 = __importDefault(require("../models/Task"));
class TasksController {
    createTaskGet(req, res) {
        res.render('tasks/create');
    }
    createTaskPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { title, description } = req.body; //get data from form
            //create a Schema for mongoose with form data
            const newTaks = new Task_1.default({
                title, description
            });
            console.log(newTaks);
            //save schema to mongodb
            yield newTaks.save();
            res.redirect('/tasks/list'); //res.send('saved');
        });
    }
}
exports.tasksController = new TasksController();
