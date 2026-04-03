import mongoose from "mongoose";
/* import { MONGODB_URI } from "./app"; */

/* mongoose.connect(MONGODB_URI)
    .then(() => console.log('Database connected'))
    .catch(error => console.error(error)) */

mongoose.connect('mongodb://127.0.0.1:27017/bondeappen')
    .then(() => console.log('Database connected'))
    .catch(error => console.error(error))

export const db = mongoose.connection;