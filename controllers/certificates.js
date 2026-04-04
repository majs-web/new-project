
import { Router } from "express";
import { Certificate } from '../models/certificates.js';

const router = Router();

// Defines event handler for HTTP GET requests to the certificates path of the app
router.get('/views/certificates', (request, response) => {
    Certificate.find({}).then(certificates => {
        response.json(certificates);
    }); // Calling json method will send array passed to it as a JSON string (good for db)
});

// Create certificate, savedCertificate = new certificate (a param in the callback function)
router.post('/views/certificates', (request, response, next) => {
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

// Functionality to update a single certificate, allowing importance to be changed
router.put('/views/certificates/:id', (request, response, next) => {
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

router.delete('/views/certificates/:id', (request, response, next) => {
    Certificate.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error => next(error))
});

export default router;