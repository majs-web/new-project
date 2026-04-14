import mongoose from "mongoose";

import { MONGODB_URI } from "./app.js";

mongoose.connect(MONGODB_URI)
    .then(result => {
        console.log('Database connected')
    })
    .catch(error => {
        console.log('error connecting to MongoDB: ', error.message)
    })

export const db = mongoose.connection;