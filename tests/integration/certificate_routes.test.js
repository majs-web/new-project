// test certificate routes

import { jest } from '@jest/globals';

await jest.unstable_mockModule('../../config/database.js', () => ({ db: {} }));
await jest.unstable_mockModule('../../config/app.js', () => ({
    JWT_SECRET: 'test_secret_key',
    PORT: 5001,
    MONGODB_URI: 'mongodb://localhost/testdb'
}));

const mockFindById = jest.fn();
const mockCertFind = jest.fn();
const mockCertFindOne = jest.fn();

await jest.unstable_mockModule('../../models/user.js', () => ({
    User: { findById: mockFindById }
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
const fakeUserId = '6642f1d2e13a4b001f3c9a01';

const fakeUser = {
    _id: { toString: () => fakeUserId, equals: (id) => id?.toString() === fakeUserId },
    username: 'testuser',
    certificates: [],
    save: jest.fn().mockResolvedValue(true)
};

const makeAuthCookie = () => {
    const token = jwt.sign({ id: fakeUserId }, JWT_SECRET, { expiresIn: '1d' });
    return `jwt=${token}`;
};

describe('Certificate routes - integration', () => {
    beforeEach(() => {
        mockFindById.mockReset();
        mockCertFind.mockReset();
        mockCertFindOne.mockReset();
        mockFindById.mockResolvedValue(fakeUser);
    });

    // GET /certificates
    describe('GET /certificates', () => {
        test('returns 200 when authenticated', async () => {
            mockCertFind.mockResolvedValue([]);

            const response = await request(App)
                .get('/certificates')
                .set('Cookie', makeAuthCookie());

            expect(response.status).toBe(200);
        });

        test('returns 401 when not authenticated', async () => {
            const response = await request(App).get('/certificates');
            expect(response.status).toBe(401);
        });
    });

    // GET /certificates/new
    describe('GET /certificates/new', () => {
        test('returns 200 when authenticatted', async () => {
            const response = await request(App)
                .get('/certificates/new')
                .set('Cookie', makeAuthCookie());

            expect(response.status).toBe(200);
        });

        test('returns 401 when not authenticated', async () => {
            const response = await request(App).get('/certificates/new');
            expect(response.status).toBe(401);
        });
    });

    // GET /certificates/:slug
    describe('GET /certificates/:slug', () => {
        test('returns 200 when certificate belongs to user', async () => {
            mockCertFindOne.mockResolvedValue({
                name: 'AWS Cloud',
                slug: 'aws-cloud',
                content: 'Cloud Fundamentals',
                date: new Date(),
                important: false,
                user: { equals: () => true }
            });

            const response = await request(App)
                .get('/certificates/aws-cloud')
                .set('Cookie', makeAuthCookie());

            expect(response.status).toBe(200);
        });

        test('returns 403 when certificate belongs to another user', async () => {
            mockCertFindOne.mockResolvedValue({
                name: 'AWS Cloud',
                slug: 'aws-cloud',
                content: 'Cloud Fundamentals',
                date: new Date(),
                important: false,
                user: { equals: () => false }
            });

            const response = await request(App)
                .get('/certificates/aws-cloud')
                .set('Cookie', makeAuthCookie());

            expect(response.status).toBe(403);
        });

        test('returns 401 when not authenticated', async () => {
            const response = await request(App).get('/certificates/aws-cloud');
            expect(response.status).toBe(401);
        });
    });

    // GET /certificates/:slug/delete
    describe('GET /certificates/:slug/delete', () => {
        test('redirects to /certificates after successful deletion', async () => {
            mockCertFindOne.mockResolvedValue({
                slug: 'aws-cloud',
                user: { equals: () => true },
                deleteOne: jest.fn().mockResolvedValue(true)
            });

            const response = await request(App)
                .get('/certificates/aws-cloud/delete')
                .set('Cookie', makeAuthCookie());

            expect(response.status).toBe(302);
            expect(response.headers['location']).toBe('/certificates');
        });

        test('returns 403 when deleting another user\'s certificate', async () => {
            mockCertFindOne.mockResolvedValue({
                slug: 'aws-cloud',
                user: { equals: () => false },
                deleteOne: jest.fn()
            });

            const response = await request(App)
                .get('/certificates/aws-cloud/delete')
                .set('Cookie', makeAuthCookie());

            expect(response.status).toBe(403);
        });

        test('returns 404 when certificate does not exist', async () => {
            mockCertFindOne.mockResolvedValue(null);

            const response = await request(App)
                .get('/certificates/nonexistent/delete')
                .set('Cookie', makeAuthCookie());

            expect(response.status).toBe(404);
        });

        test('returns 401 when not authenticated', async () => {
            const response = await request(App).get('/certificates/aws-cloud/delete');
            expect(response.status).toBe(401);
        });
    });

    // POST /certificates/:slug/edit
    describe('POST /certificates/:slug/edit', () => {
        test('returns 400 when date is missing', async () => {
            mockCertFindOne.mockResolvedValue({
                slug: 'aws-cloud',
                user: { equals: () => true },
                save: jest.fn()
            });

            const response = await request(App)
                .post('/certificates/aws-cloud/edit')
                .set('Cookie', makeAuthCookie())
                .send({ name: 'AWS Cloud', content: 'Updated', important: false });

            expect(response.status).toBe(400);
        });

        test('returns 403 when editing another user\'s certificate', async () => {
            mockCertFindOne.mockResolvedValue({
                slug: 'aws-cloud',
                user: { equals: () => false }
            });

            const response = await request(App)
                .post('/certificates/aws-cloud/edit')
                .set('Cookie', makeAuthCookie())
                .send({ name: 'AWS', date: '2024-01-01', content: 'x', important: false });

            expect(response.status).toBe(403);
        });

        test('returns 404 when certificate does not exist', async () => {
            mockCertFindOne.mockResolvedValue(null);

            const response = await request(App)
                .post('/certificates/ghost/edit')
                .set('Cookie', makeAuthCookie())
                .send({ name: 'x', date: '2024-01-01', content: 'x' });

            expect(response.status).toBe(404);
        });
    });
});