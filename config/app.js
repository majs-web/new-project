
import 'dotenv/config';

export const PORT = process.env.PORT;

export const MONGODB_URI = process.env.MONGODB_URI; 

//Separate modes for development and testing -> remove the one line above 
// See part 4: testing
// NB: Must add NODE_ENV and cross-env to script in json package
/* const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI */


