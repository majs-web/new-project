
import jwt from 'jsonwebtoken';
import { User } from '../models/user1';

export const requireAuth = (request, response, next) => {
    const token = request.cookies.jwt;

    // check json web token exists and is verified
    if (token) {
        jwt.verify(token, 'secret-should-be-long-dont-post-it', (error, decodedToken) => {
            if (error) {
                console.log(error.message);
                response.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        })
    }
    else {
        response.redirect('/login');
    }
}

// Check if current user is logged in
export const checkUser = (request, response, next) => {
    const token = request.cookies.jwt;

    if (token) {
        jwt.verify(token, 'secret-should-be-long-dont-post-it', async (error, decodedToken) => {
            if (error) {
                console.log(error.message);
                response.locals.user = null;
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                response.locals.user = user;
                next();
            }
        })
    } else {
        response.locals.user = null;
        next();
    }
}