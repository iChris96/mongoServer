import App from './app';
import database from "./database";

//start db
database();

//start server
const app = new App(); 
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
    npm i @types/mongoose -D
    npm i @types/bcryptjs -D 
    npm i @types/jsonwebtoken -D
    npm i @types/express-serve-static-core -D -> instead of @types/express

uninstall packages
    npm uninstall <name> removes the module from node_modules, but not package.json
    npm uninstall <name> --save also removes it from dependencies in package.json
    npm uninstall <name> --save-dev also removes it from devDependencies in package.json
    npm -g uninstall <name> --save also removes it globally

*/