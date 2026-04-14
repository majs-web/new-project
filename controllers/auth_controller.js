
import { Router } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config/app.js";

const router = Router();
const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: maxAge });
}

router.get('/signup', (request, response) => {
    response.render('signup');
})

router.get('/login', (request, response) => {
    response.render('login');
})

router.post('/signup', async (request, response) => {
    try {
        const { email, username, password } = request.body;
        const user = await User.create({ email, username, password });
        const token = createToken(user._id);

        response
            .cookie('jwt', token, {
                httpOnly: true, 
                sameSite: 'lax',
                // set to true when deployed
                secure: false,
                maxAge: maxAge * 1000 
            });
            response.status(201).json({ user: user._id });
    } catch (error) {
        console.log('Signup error: ', error.message);
        response.status(400).json({ error: error.message });
    };
});

// When login correct -> cookie (jwt)
router.post('/login', async (request, response) => {
    try {
        const { email, password } = request.body;
        const user = await User.login(email, password);
        const token = createToken(user._id);

        response.cookie('jwt', token, { 
            httpOnly: true, 
            sameSite: 'lax',
            // set to true when deployed
            secure: false,
            maxAge: maxAge * 1000 
        })
        response.status(200).json({ 
            user: user._id, 
            email: user.email, 
            username: user.username 
        });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
})

// Replaces the jwt cookie which lets the user stay logged in
// Empty string value removes/replaces the token value
// Expires very quickly (1ms)
router.get('/logout', (request, response) => {
    response.cookie('jwt', '', { maxAge: 1 });

    return response.redirect('/');
})

export default router;