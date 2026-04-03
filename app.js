import express from 'express';

// Import config files
import { PORT } from './config/app.js';
import './config/database.js';

// Import controller files
import simpleRoutes from './controllers/simple-pages.js';
import certificatesRoutes from './controllers/certificates.js';
import loginRoutes from './controllers/login.js';
import userRoutes from './controllers/user.js';

const app = express();

app.use(express.static('public'));

// Built-in middleware, allows us to read data sent through HTML forms
app.use(express.urlencoded({ extended: true }));

// Tells Express to use EJS as a templating engine
app.set('view engine', 'ejs');

// Add route functions
app.use(simpleRoutes);
app.use(certificatesRoutes);
app.use(loginRoutes);
app.use(userRoutes);

app.listen(PORT, () => {
    console.log(`Started server on port ${PORT}`);
});