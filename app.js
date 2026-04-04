import express from 'express';

// Import middleware
import { errorHandler, requestLogger, unkownEndpoint } from './middlewares/logger.js';

// Import config files
import './config/database.js';

// Import controller files
import simpleRoutes from './controllers/simple-pages.js';
import certificatesRoutes from './controllers/certificates.js';
import loginRoutes from './controllers/login.js';
import userRoutes from './controllers/user.js';

const app = express();

app.use(express.static('public'));

// json-parser takes JSON data of a request, transforms it into JavaScript object,
// then attached it to the body property of the request object before the route
// handler is called (HTTP POST request)
app.use(express.json());

// Built-in middleware, allows us to read data sent through HTML forms
app.use(express.urlencoded({ extended: true }));

// Tells Express to use EJS as a templating engine
app.set('view engine', 'ejs');

// Has to be used after json parser for request body to be initialized when logger is executed
app.use(requestLogger);

// Add route functions
app.use(simpleRoutes);
app.use('/views/certificates', certificatesRoutes); // 
app.use(loginRoutes);
app.use(userRoutes);

// This middleware after routes to catch requests maed to non-existent routes
app.use(unkownEndpoint);

app.use(errorHandler);

export const App = app;