
//NB: to select which test file should be executed, instead of all:
// -> npm test -- --/certificates_views.test.js

// For running tests with a specific name
// -> npm test -- --test-name-pattern="a specific certificate is within the returned certificates"
// Can also contain just part of the name:
// -> npm run test -- --test-name-pattern="certificates"

import assert from 'node:assert';
import { test, after, beforeEach, describe } from 'node:test';
import mongoose from 'mongoose';
import supertest from 'supertest';
// Uses app from app.js, not index.js, which does not listen for a port
// supertest takes care of it
import app from '../app.js';
import helper from './test_helper.js';
import { Certificate } from '../models/certificates';

// Wrap app.js with the supertest function
const api = supertest(app);

// db cleared out in beginning -> we save the two certificates above
// stored in the initialCertificattes array to the db
// -> this ensures that the db is in the same state before every test run
describe('when there is initially some certificates saved', () => {
    beforeEach(async () => {
        await Certificate.deleteMany({})
        await Certificate.insertMany(helper.initialCertificates)

    })

    // Makes HTTP GET request, verifies that request responded with status code 200
    // + verifies that content-type is set to app/json
    test('certificates are returned as json', async () => {
        await api
            .get('/views/certificates')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    // inspecting the response data stored in the response.body property 
    // verify the format and content with the strictEqual method
    test('all certificatets are returned', async () => {
        const response = await api.get('/views/certificates')

        assert.strictEqual(response.body.length, helper.initialCertificates.length)
    })
    // here using assert to verify that the certificate is among the returned ones
    test('a specific certificate is within the returned certificates', async () => {
        const response = await api.get('/views/certificates')

        const contents = response.body.map(e => e.content)
        assert(contents.includes('Fire Certificate'))
    })

    describe ('viewing a specific certificate', () => {
        test('succeeds with a valid id', async () => {
            const certificatesAtStart = await helper.certificatesInDb()
            const certficateToView = certificatesAtStart[0]

            const resultCertificate = await api
                .get(`/views/certificates/${certficateToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.deepStrictEqual(resultCertificate.body, certficateToView)
        })

        test('fails with statuscode 404 if certificate does not exist', async () => {
            const validNonexistingId = await helper.nonExistingId()

            await api
                .get(`/views/certificates/${validNonexistingId}`).expect(404)
        })

        test('fails with statuscode 400 id is invalid', async () => {
            const invalidId = '5a3d5da59070081a82a3445'
            await api.get(`/views/certificates/${invalidId}`).expect(400)
        })
    })

    describe('addition of a new certificate', () => {
        test('succeeds with valid data', async () => {
            const newCertificate = {
                content: 'async/awaits simplifies making async calls',
                important: true,
            }

            await api
                .post('/views/certificates')
                .send(newCertificate)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const certficatesAtEnd = await helper.certificatesInDb()
            assert.strictEqual(certficatesAtEnd.length, helper.initialCertificates.length + 1)

            const contents = certficatesAtEnd.map(n => n.content)
            assert(contents.includes('async/await simplifies making async calls'))
        })

        test('fails with status code 400 if data invalid', async () => {
            const newCertificate = { important: true }

            await api.post('/views/certificates').send(newCertificate).expect(400)

            const certficatesAtEnd = await helper.certificatesInDb()

            assert.strictEqual(certficatesAtEnd.length, helper.initialCertificates.length)
        })

        describe('deletion of a certificate', () => {
            test('succeeds with status code 204 if id is valid', async () => {
                const certificatesAtStart = await helper.certificatesInDb()
                const certficateToDelete = certificatesAtStart[0]

                await api
                    .delete(`/views/certificates/${certficateToDelete.id}`).expect(204)
                    
                    const certficatesAtEnd = await helper.certificatesInDb()

                    const ids = certficatesAtEnd.map(n => n.id)
                    assert(!ids.includes(certficateToDelete.id))

                    assert.strictEqual(certficatesAtEnd.length, helper.initialCertificates - 1)
            })
        })
    })
})

after(async () => {
    await mongoose.connection.close()
});