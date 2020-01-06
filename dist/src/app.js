"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan")); //listening http events
const express_handlebars_1 = __importDefault(require("express-handlebars"));
const path_1 = __importDefault(require("path")); //path join folders routes independently be linux or windows path
const multer_1 = __importDefault(require("multer"));
//ROUTES
const routes_1 = __importDefault(require("./routes"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const json_1 = __importDefault(require("./routes/json"));
const auth_1 = __importDefault(require("./routes/auth"));
const storage = multer_1.default.diskStorage({
    destination: path_1.default.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
class Application {
    constructor() {
        this.app = express_1.default();
        //trigger functions when Application object is created
        this.settings();
        this.middlewares();
        this.routes();
    }
    settings() {
        //variables
        this.app.set('port', 3000); //its like a variable into app object
        this.app.set('views', path_1.default.join(__dirname, 'views')); //__dirname -> actual directory //now node knows where /views directory is localized
        //handlebars
        //set engine
        this.app.engine('.hbs', express_handlebars_1.default({
            layoutsDir: path_1.default.join(this.app.get('views'), 'layouts'),
            partialsDir: path_1.default.join(this.app.get('views'), 'partials'),
            defaultLayout: 'main',
            extname: '.hbs'
        }));
        //use engine
        this.app.set('view engine', '.hbs');
    }
    middlewares() {
        this.app.use(morgan_1.default('dev'));
        this.app.use(express_1.default.json()); //app understands json
        this.app.use(express_1.default.urlencoded({ extended: false })); //html form data interpreter
        this.app.use(multer_1.default({
            storage,
            dest: path_1.default.join(__dirname, 'public/uploads')
        }).single('hola'));
    }
    routes() {
        this.app.use(routes_1.default);
        this.app.use('/tasks', tasks_1.default);
        this.app.use('/json', json_1.default); // rutas de json
        this.app.use('/auth', auth_1.default);
        this.app.use(express_1.default.static(path_1.default.join(__dirname, 'public'))); //server knows public folder
    }
    start() {
        this.app.listen(this.app.get('port'), () => { console.log('App on port', this.app.get('port')); });
    }
}
exports.default = Application;
//# sourceMappingURL=app.js.map