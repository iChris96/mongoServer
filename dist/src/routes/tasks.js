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
const express_1 = require("express");
const tasksController_1 = require("../controllers/tasksController");
const router = express_1.Router();
// Models
const Task_1 = __importDefault(require("../models/Task"));
//CREATE TASK
router.route('/create')
    .get(tasksController_1.tasksController.createTaskGet)
    .post(tasksController_1.tasksController.createTaskPost);
//GET TASKS AS VIEWNP
router.route('/list')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskList = yield Task_1.default.find();
    console.log(taskList);
    res.render('tasks/list', { taskList });
}));
//GET TASKS AS JSON
router.route('/all')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskList = yield Task_1.default.find();
    console.log(taskList);
    return res.status(200).json(taskList);
}));
//DELETE TASK
router.route('/delete/:id')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    yield Task_1.default.findByIdAndDelete(id);
    res.redirect('/tasks/list');
}));
//Edit TASK
router.route('/edit/:id')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    //console.log(id);
    const task = yield Task_1.default.findById(id);
    //console.log(task);
    res.render('tasks/edit', { task });
}))
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; //get data from url 
    const { title, description } = req.body; //get data from form
    //update task into db
    yield Task_1.default.findByIdAndUpdate(id, { title, description });
    res.redirect('/tasks/list');
}));
/*
router.get(
    '/',
    (req:Request, res:Response) => {
        res.render('index');
    }
)
*/
exports.default = router;
//# sourceMappingURL=tasks.js.map