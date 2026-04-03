
import { Router } from "express";

const router = Router();

router.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});


export default router;