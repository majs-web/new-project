import express from 'express';
import { PORT } from './config/app.js';
import './config/database.js';

const app = express();

app.use(express.static('public'));

// Built-in middleware, allows us to read data sent through HTML forms
app.use(express.urlencoded({ extended: true }));

// Tells Express to use EJS as a templating engine
app.set('view engine', 'ejs');

app.listen(PORT, () => {
    console.log(`Started server on port ${PORT}`);
});