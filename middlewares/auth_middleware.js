
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { JWT_SECRET } from '../config/app.js';

export const requireAuth = (request, response, next) => {
    const token = request.cookies.jwt;

    // check json web token exists and is verified
    if (!token) {
        return response.status(401).json({ error: 'Not authorized' });
    };
    jwt.verify(token, JWT_SECRET, async (error, decodedToken) => {
        if (error) { return response.status(401).json({ error: 'Not authorized' }); };

        const user = await User.findById(decodedToken.id);
        response.locals.user = user;

        next();
    });
};

// Check if current user is logged in
export const checkUser = (request, response, next) => {
    const token = request.cookies.jwt;

    if (!token) {
        response.locals.user = null;
        return next();
    };
    jwt.verify(token, JWT_SECRET, async (error, decodedToken) => {
        if (error) {
            response.locals.user = null;
            return next();
        }
        const user = await User.findById(decodedToken.id);
        response.locals.user = user || null;
        next();
    });
};
