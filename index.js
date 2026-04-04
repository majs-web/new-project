// Imports the application from the app.js, then starts the app

import { App } from './app.js';
import { PORT } from './config/app.js';

App.listen(PORT, () => {
    console.log(`Started server on port ${PORT}`);
});