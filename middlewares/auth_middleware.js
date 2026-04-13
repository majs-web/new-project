
import jwt from 'jsonwebtoken';


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

