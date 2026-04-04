
import { Router } from "express";
import { Certificate } from '../models/certificates.js';

const router = Router();

//NB: All routes now only '/', path set in app.js

// Defines event handler for HTTP GET requests to the certificates path of the app
router.get('/', (request, response) => {
    Certificate.find({}).then(certificates => {
        response.json(certificates);
    }); // Calling json method will send array passed to it as a JSON string (good for db)
});

// Using Mongoose findById method to fetch individual certficates
router.get('/views/certificates/:id', (request, response, next) => {
    Certificate.findById(request.params.id)
        .then(certificate => {
            if (certificate) {
                response.json(certificate)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
});

// Create certificate, savedCertificate = new certificate (a param in the callback function)
router.post('/', (request, response, next) => {
    const body = request.body;

    const certificate = new Certificate({
        content: body.content,
        important: body.important || false,
    });

    certificate.save()
        .then(savedCertificate => {
            response.json(savedCertificate);
        })
        .catch(error => next(error));
});

router.delete('/:id', (request, response, next) => {
    Certificate.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
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