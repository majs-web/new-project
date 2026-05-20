// end-to-end test -- user journey

// simulates user flow via HTTP:
// 1. Sign up
// 2. Log in and receive cookie
// 3. Authenticated user visits profile
// 4. User views certificate list
// 5. User views a specific certificate
// 6. User logs out
// 7. After logout, protected routes return 401

// Does not use a real db

import { describe, expect, jest } from '@jest/globals';

await jest.unstable_mockModule('../../config/database.js', () => ({ db: {} }));
await jest.unstable_mockModule('../../config/app.js', () => ({
    JWT_SECRET: 'test_secret_key',
    PORT: 5001,
    MONGODB_URI: 'mongodb://localhost/testdb'
}));

const mockCreate = jest.fn();
const mockLogin = jest.fn();
const mockFindById = jest.fn();
const mockCertFind = jest.fn();
const mockCertFindOne = jest.fn();

await jest.unstable_mockModule('../../models/user.js', () => ({
    User: {
        create: mockCreate,
        login: mockLogin,
        findById: mockFindById
    }
}));

await jest.unstable_mockModule('../../models/certificates.js', () => ({
    Certificate: {
        find: mockCertFind,
        findOne: mockCertFindOne
    }
}));

import jwt from 'jsonwebtoken';
import request from 'supertest';
const { App } = await import('../../app.js');

const JWT_SECRET = 'test_secret_key';
const userId = '6642f1d2e13a4b001f3c9a01';

const fakeUser = {
    _id: userId,
    email: 'jane@example.com',
    username: 'jane_doe',
    certificates: [],
    save: jest.fn().mockResolvedValue(true)
};

// captured after login, shared across steps
let authCookie = '';

describe('E2E: Full user journey', () => {

    // Step 1: Sign up
    describe('Step 1: User signs up', () => {
        test('POST /signup returns 201 and sets a jwt cookie', async () => {
            mockCreate.mockResolvedValue(fakeUser);
            mockFindById.mockResolvedValue(null);

            const response = await request(App)
                .post('/signup')
                .send({
                    email: 'jane@example.com',
                    username: 'jane_doe',
                    password: 'securepass123'
                });

            expect(response.status).toBe(201);
            expect(response.body.user).toBeDefined();

            const cookies = response.headers['set-cookie'];
            expect(cookies).toBeDefined();
            expect(cookies[0]).toMatch(/jwt=/);
        });
    });

    // Step 2: Login
    describe('Step 2: User logs in', () => {
        test('POST /login returns 200, user info, and jwt cookie', async () => {
            mockLogin.mockResolvedValue(fakeUser);
            mockFindById.mockResolvedValue(null);

            const response = await request(App)
                .post('/login')
                .send({ email: 'jane@example.com', password: 'securepass123' });

            expect(response.status).toBe(200);
            expect(response.body.email).toBe('jane@example.com');
            expect(response.body.username).toBe('jane_doe');

            const cookies = response.headers['set-cookie'];
            expect(cookies).toBeDefined();

            // capture cookie for following steps
            authCookie = cookies[0].split(';')[0];
            expect(authCookie).toMatch(/^jwt=/);
        });
    });

    // Step 3: Access profile page
    describe('Step 3: User visits profile', () => {
        test('GET /profile returns 200 with valid jwt cookie', async () => {
            mockFindById.mockResolvedValue(fakeUser);

            const response = await request(App)
                .get('/profile')
                .set('Cookie', authCookie);

            expect(response.status).toBe(200);
        });
    });

    // Step 4: View certificates list
    describe('Step 4: User views certificate list', () => {
        test('GET /certificates returns 200', async () => {
            mockFindById.mockResolvedValue(fakeUser);
            mockCertFind.mockResolvedValue([]);

            const response = await request(App)
                .get('/certificates')
                .set('Cookie', authCookie);

            expect(response.status).toBe(200);
        });
    });

    // Step 5: View a specific certificate
    describe('Step 5: User views certificate', () => {
        test('GET /certificates/:slug returns 200 for owned certificate', async () => {
            mockFindById.mockResolvedValue(fakeUser);
            mockCertFindOne.mockResolvedValue({
                name: 'AWS Cloud Practitioner',
                slug: 'aws-cloud-practitionaer',
                content: 'Cloud basics',
                date: new Date(),
                important: true,
                user: { equals: () => true }
            });

            const response = await request(App)
                .get('/certificates/aws-cloud-practitioner')
                .set('Cookie', authCookie);

            expect(response.status).toBe(200);
        });
    });

    // Step 6: Log out
    describe('Step 6: User logs out', () => {
        test('GET /logout redirects to /', async () => {
            mockFindById.mockResolvedValue(fakeUser);

            const response = await request(App)
                .get('/logout')
                .set('Cookie', authCookie);

            expect(response.status).toBe(302);
            expect(response.headers['location']).toBe('/');
        });
    });

    // Step 7: Protected routes blocked after logout
    describe('Step 7: Protected routes not accessible without cookie', () => {
        test('GET /profile without cookie returns 401', async () => {
            const response = await request(App).get('/profile');
            expect(response.status).toBe(401);
        });

        test('GET /certificates without cookie returns 401', async () => {
            const response = await request(App).get('/certificates');
            expect(response.status).toBe(401);
        });
    });
});