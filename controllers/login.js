
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Router } from "express";
import { User } from '../models/user.js';

const loginRouter = Router();

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    // searches for user from the db by username attached to request
    const user = await User.findOne({ username })

    // checks the password, also attatched to the request
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash) //because passwords not saved to db, 
        // but hashes, bcrypt.compare is used to check if password correct

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    // if password correct, token is created with jwt.sign, containing username and
    //user id in a digitally signed form
    const userForToken = {
        username: user.username,
        id: user._id,
    }
    const token = jwt.sign(
        userForToken, 
        process.env.SECRET,
        { expiresIn: 60*60 } // Token expires, client forced to re-login
    )

    response
        .status(200)
        .send({ token, username: user.username, name: user.name })
})

export default loginRouter;