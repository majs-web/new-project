import express from 'express';

// Import middleware
import { errorHandler, requestLogger, unkownEndpoint } from './middlewares/logger.js';
import cookieParser from 'cookie-parser';

// Import config files
import './config/database.js';

// Import controller files
import simpleRouter from './controllers/simple-pages.js';
import certificateRouter from './controllers/certificates.js';
import loginRouter from './controllers/login.js';
import usersRouter from './controllers/users.js';

import authRouter from './routes/auth_routes.js';

const app = express();

app.use(express.static('public'));

// json-parser takes JSON data of a request, transforms it into JavaScript object,
// then attached it to the body property of the request object before the route
// handler is called (HTTP POST request)
app.use(express.json());

// Built-in middleware, allows us to read data sent through HTML forms
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Tells Express to use EJS as a templating engine
app.set('view engine', 'ejs');

// Tells Express to look for ejs files in 'views' folder
app.set('views', 'views');

// Has to be used after json parser for request body to be initialized when logger is executed
app.use(requestLogger);

// Add route functions
app.use(simpleRouter);
app.use('/profile/certificates', certificateRouter); // 
app.use(loginRouter);
app.use('/signup', usersRouter);
/* app.use('/profile', profileRouter); */

app.use(authRouter)

// This middleware after routes to catch requests made to non-existent routes
app.use(unkownEndpoint);

app.use(errorHandler);

export const App = app;