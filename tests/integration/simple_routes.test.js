// test simple routes

import { jest } from '@jest/globals';

await jest.unstable_mockModule('../../config/database.js', () => ({ db: {} }));
await jest.unstable_mockModule('../../config/app.js', () => ({
    JWT_SECRET: 'test_secret_key',
    PORT: 5001,
    MONGODB_URI: 'mongodb://localhost/testdb'
}));

const mockFindById = jest.fn();

await jest.unstable_mockModule('../../models/user.js', () => ({
    User: { findById: mockFindById }
}));

await jest.unstable_mockModule('../../models/certificates.js', () => ({
    Certificate: { find: jest.fn(), findOne: jest.fn() }
}));

import jwt from 'jsonwebtoken';
import request from 'supertest';
const { App } = await import('../../app.js');

const JWT_SECRET = 'test_secret_key';
const fakeUser = { _id: 'user123', username: 'testuser', certificates: [] };
const makeAuthCookie = () => {
    const token = jwt.sign({ id: 'user123' }, JWT_SECRET, { expiresIn: '1d' });
    return `jwt=${token}`;
};

describe('Simple routes - integration', () => {
    beforeEach(() => {
        mockFindById.mockReset();
        mockFindById.mockResolvedValue(fakeUser);
    });

    // ── GET / ─────────────────────────────────────────────────
    describe('GET /', () => {
        test('returns 200 for unauthenticated users', async () => {
            mockFindById.mockResolvedValue(null);
            const response = await request(App).get('/');
            expect(response.status).toBe(200);
        });

        test('returns 200 for authenticated users', async () => {
            const response = await request(App)
                .get('/')
                .set('Cookie', makeAuthCookie());
            expect(response.status).toBe(200);
        });
    });

    // ── GET /about ────────────────────────────────────────────
    describe('GET /about', () => {
        test('returns 200', async () => {
            mockFindById.mockResolvedValue(null);
            const response = await request(App).get('/about');
            expect(response.status).toBe(200);
        });
    });

    // ── GET /legal ────────────────────────────────────────────
    describe('GET /legal', () => {
        test('returns 200', async () => {
            mockFindById.mockResolvedValue(null);
            const response = await request(App).get('/legal');
            expect(response.status).toBe(200);
        });
    });

    // ── GET /profile ──────────────────────────────────────────
    describe('GET /profile', () => {
        test('returns 401 when not authenticated', async () => {
            const response = await request(App).get('/profile');
            expect(response.status).toBe(401);
        });

        test('returns 200 when authenticated', async () => {
            const response = await request(App)
                .get('/profile')
                .set('Cookie', makeAuthCookie());
            expect(response.status).toBe(200);
        });
    });

    // ── Unknown routes ────────────────────────────────────────
    describe('Unknown routes', () => {
        test('returns 404 for unknown route', async () => {
            mockFindById.mockResolvedValue(null);
            const response = await request(App).get('/this-does-not-exist');
            expect(response.status).toBe(404);
        });
    });
});