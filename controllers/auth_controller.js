
import { User } from '../models/user1.js';
import jwt from 'jsonwebtoken';

// handle errors

const handleErrors = (error) => {
    console.log(error.message, error.code);
    let errors = { email: '', username: '', password: ''};

    // incorrect email
    if (error.message === 'incorrect email') {
        errors.email = 'that email is not registered';
    }

    // incorrect password
    if (error.message === 'incorrect password') {
        errors.password = 'that password is incorrect';
    }

    // duplicate error code
    if (error.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    // validation errors
    if (error.message.includes('user validation failed')) {
        Object.values(error.errors).forEach(({properties}) => {
            error[properties.path] = properties.message;
        });
    }

    return errors;
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, 'secret-should-be-long-dont-post-it', {
        expiresIn: maxAge
    });
}

export const signup_get = (request, response) => {
    response.render('signup');
}

export const login_get = (request, response) => {
    response.render('login');
}

export const signup_post = async (request, response) => {
    const { email, username, password } = request.body;

    try {
        const user = await User.create({ email, username, password });
        const token = createToken(user._id);
        response.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        response.status(201).json({ user: user._id });
    }
    catch (error) {
        const errors = handleErrors(error);
        response.status(400).json({ errors });
    };
};

// When login correct -> cookie (jwt)
export const login_post = async (request, response) => {
    const { email, password } = request.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        response.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        response.status(200).json({ user: user._id });
    }
    catch (error) {
        const errors = handleErrors(error);
        response.status(400).json({ errors });
    }
}

// Replaces the jwt cookie which lets the user stay logged in
// Empty string value removes/replaces the token value
// Expires very quickly (1ms)
export const logout_get = (request, response) => {
    response.cookie('jwt', '', { maxAge: 1 });

    response.redirect('/');
}