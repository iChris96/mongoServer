"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./database"));
//start db
database_1.default();
//start server
const app = new app_1.default();
app.start();
/*
build commands
    npx tsc -> make ./dist
    node dist/index.js -> Run server
    npm run clean -> remove ./dist folder independently witch ServerOS is running
    npx nodemon -> invokes npm run dev RUN DEV SERVER
    npm run public -> copy public folder to ./dist from ./src
    npm run hbscopy -> copy views+ folder to ./dist from ./src
    npm run build -> to build .dist server
    npm start -> to run .dist server


instalation commands
    tsc --init -> typescript (tsconfig.json)
    npm i typescript -D -> typescript project dependency
    npm i ts-node -> typescript & node helper commands module
    npm i @types/express -D -> IDE autocompletation of express module
    npm i nodemon -D -> watcher files module (nodemon.json)

*/ 
