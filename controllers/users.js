
import bcrypt from 'bcrypt';
import { Router } from 'express';
import { User } from '../models/user.js';

const usersRouter = Router();

usersRouter.get('/', (request, response) => {
    response.render('signup')
})

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('certificates', { content: 1, important: 1 }) 
        //.populate to get user objects to contain user's notes, not jus id
        // we want only userid, content and important, not user nr. the {} above does that.
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    response
        .status(201)
        .redirect('/login')
})

export default usersRouter;