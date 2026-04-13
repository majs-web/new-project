
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
