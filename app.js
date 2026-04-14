import express from 'express';

// Import middleware
import cookieParser from 'cookie-parser';
import { checkUser } from './middlewares/auth_middleware.js';

// Import config files
import './config/database.js';

const app = express();

app.use(express.static('public'));

// json-parser takes JSON data of a request, transforms it into JavaScript object,
// then attached it to the body property of the request object before the route
// handler is called (HTTP POST request)
app.use(express.json());

// Built-in middleware, allows us to read data sent through HTML forms
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use((request, response, next) => {
    if (request.method === 'GET') {
        return checkUser(request, response, next);
    };
    next();
});

import simpleRouter from './controllers/routes.js';
import authRouter from './controllers/auth_controller.js';
import certRouter from './controllers/certificate_controller.js';

// Tells Express to use EJS as a templating engine
app.set('view engine', 'ejs');

// Tells Express to look for ejs files in 'views' folder
app.set('views', 'views');

// Add route functions
app.use(simpleRouter);
app.use(authRouter);
app.use(certRouter);

export const App = app;