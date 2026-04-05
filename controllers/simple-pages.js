
import { Router } from "express";

const simpleRouter = Router();

simpleRouter.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});


export default simpleRouter;