
import { Router } from "express";

const router = Router();

//Define the root
router.get('/', (request, response) => {
    response.render('index', {root: './'});
});

router.get('/legal', (request, response) => {
    response.render('legal');
});

router.get('/about', (request, response) => {
    response.render('about');
});


export default router;