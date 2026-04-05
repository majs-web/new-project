
import { Router } from "express";
import { Certificate } from '../models/certificates.js';
import { User } from '../models/user.js';

const router = Router();

//NB: All routes now only '/', path set in app.js

// Defines event handler for HTTP GET requests to the certificates path of the app
router.get('/', async (request, response) => {
    const certificates = await Certificate
        .find({}).populate('user', { username: 1, name: 1 })
        // .populate + {} returns username and name with the certificates

    response.json(certificates); // Calling json method will send array passed to it as a JSON string (good for db)
});

// Using Mongoose findById method to fetch individual certficates
router.get('/:id', async (request, response) => {
    const certficate = await Certificate.findById(request.params.id)
    if (certficate) {
        response.json(certificate)
    } else {
        response.status(404).end()
    }
});

// Create certificate, savedCertificate = new certificate (a param in the callback function)
router.post('/', async (request, response) => {
    const body = request.body;

    const user = await User.findById(body.userId)

    if(!user) {
        return response.status(400).json({ error: 'userId missing or not valid' })
    }

    const certificate = new Certificate({
        content: body.content,
        important: body.important || false,
        user: user._id
    });

    const savedCertificate = await certificate.save()
    user.certificates = user.certificates.concat(savedCertificate._id)
    await user.save()

    response.status(201).json(savedCertificate)
});

router.delete('/:id', async (request, response) => {
    await Certificate.findByIdAndDelete(request.params.id)
            response.status(204).end()
});

// Functionality to update a single certificate, allowing importance to be changed
router.put('/:id', (request, response, next) => {
    const { content, important } = request.body;

    Certificate.findById(request.params.id)
        .then(certificate => {
            if (!certificate) {
                return response.status(404).end()
            }

            certificate.content = content
            certificate.important = important
            
            return certificate.save().then((updatedCertificate) => {
                response.json(updatedCertificate)
            });
        })
        .catch(error => next(error))
});

export default router;