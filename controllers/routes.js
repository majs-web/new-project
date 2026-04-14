
import { Router } from 'express';
import { requireAuth } from "../middlewares/auth_middleware.js";

const router = Router();

//Define the root
router.get('/', (request, response) => {
    response.render('index', {root: './'});
});

router.get('/about', (request, response) => {
    response.render('about');
});

router.get('/legal', (request, response) => {
    response.render('legal');
});

router.get('/profile', requireAuth, (request, response) => {
    response.render('profile');
});

export default router;