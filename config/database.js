import mongoose from "mongoose";

/* import { MONGODB_URI } from "./app"; */

/* mongoose.connect(MONGODB_URI)
    .then(result => {
        console.log('Database connected')
    })
    .catch(error => {
        console.log('error connecting to MongoDB: ', error.message)
    })*/
        
mongoose.set('strictQuery', false);

mongoose.connect('mongodb://127.0.0.1:27017/bondeappen')
    .then(() => console.log('Database connected'))
    .catch(error => console.error(error))

export const db = mongoose.connection;