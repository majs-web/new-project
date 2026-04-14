
import { Certificate } from '../models/certificates.js';
import { Router } from 'express';
import { requireAuth } from '../middlewares/auth_middleware.js';

const router = Router();


router.get('/certificates', requireAuth, async (request, response) => {
    const user = response.locals.user;
    const certificates = await Certificate.find({ user: user._id });
    response.render('certificates/index', { certificates });
});

// GET new certificate form
router.get('/certificates/new', requireAuth, (request, response) => {
    response.render('certificates/new');
});

router.post('/certificates/new', requireAuth, async (request, response) => {
    console.log('Body Received', request.body);
    try {
        const user = response.locals.user;
        const { name, date, content, important } = request.body;

        const certificate = new Certificate({
            name,
            date,
            content,
            important: important || false,
            user: user._id
        });

        const savedCertificate = await certificate.save();
        
        user.certificates.push(savedCertificate._id);
        await user.save();

        response.status(201).json(savedCertificate);
    } catch(error) {
        console.error(error);
        response.status(400).json({ error: 'Certificate could not be created'});
    };
}); 


router.get('/certificates/:slug', requireAuth, async (request, response) => {
    const certificate = await Certificate.findOne({ slug: request.params.slug });

    if (!certificate.user.equals(response.locals.user._id)) {
        return response.status(403).send('Not authorized');
    };

    response.render('certificates/show', { certificate: certificate });
});

// GET edit certificate page
router.get('/certificates/:slug/edit', requireAuth, async (request, response) => {
    try {
        const certificate = await Certificate.findOne({ slug: request.params.slug });
        if (!certificate) return response.status(404).send('Not found');
        
        if (!certificate.user.equals(response.locals.user._id))
            return response.status(403).send('Not authorized');
            
        response.render('certificates/edit', { certificate: certificate });
    }catch(error) {
        console.error(error);
        response.status(404).send('Could not edit.');
    };
});

// POST update certificate
router.post('/certificates/:slug/edit', requireAuth, async (request, response) => {
    try {
        const certificate = await Certificate.findOne({ slug: request.params.slug });
        if (!certificate) return response.status(404).send('Not found');

        if (!certificate.user.equals(response.locals.user._id))
            return response.status(403).send('Not authorized');

        if (!request.body.date) {
            return response.status(400).send('Need to add a date');
        }

        certificate.name = request.body.name;
        certificate.date = request.body.date;
        certificate.content = request.body.content;
        certificate.important = request.body.important || false;

        await certificate.save();

        response.redirect(`/certificates/${certificate.slug}`);
    }catch(error) {
        console.error(error);
        response.send('Error: The certificate could not be updated.');
    };
});

// DELETE certificate
router.get('/certificates/:slug/delete', requireAuth, async (request, response) => {
    try {
        const certificate = await Certificate.findOne({ slug: request.params.slug });
        if (!certificate) return response.status(404).send('Not found');

        if (!certificate.user.equals(response.locals.user._id))
            return response.status(403).send('Not authorized');

        await certificate.deleteOne();
        response.redirect('/certificates');
    }catch(error) {
        console.error(error);
        response.send('Error: No certificate was deleted.');
    };
});

export default router;
