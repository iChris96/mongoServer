import App from './app';
import database from "./database";

//start db
database();

//start server
const app = new App();
app.start();



//npx tsc -> make ./dist
//node dist/index.js -> Run server
//npm run clean -> remove ./dist folder independently witch ServerOS is running
//npx nodemon -> invokes npm run dev
//npm run public -> copy public folder to ./dist from ./src
//npm run hbscopy -> copy views+ folder to ./dist from ./src
//npm run build -> to build .dist server
//npm start -> to run .dist server