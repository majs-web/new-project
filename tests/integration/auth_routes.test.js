// test auth routes (/signup, /login, /logout)
// use supertest + jest.unstable_mockModule

import { beforeEach, describe, expect, jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import request from 'supertest';

// mockin db
await jest.unstable_mockModule('../../config/database.js', () => ({ db: {} }));
await jest.unstable_mockModule('../../config/app.js', () => ({
    JWT_SECRET: 'test_secret_key',
    PORT: 5001,
    MONGODB_URI: 'mongodb://localhost/testdb'
}));

const mockCreate = jest.fn();
const mockLogin = jest.fn();
const mockFindById = jest.fn();

await jest.unstable_mockModule('../../models/user.js', () => ({
    User: {
        create: mockCreate,
        login: mockLogin,
        mockFindById: mockFindById
    }
}));

const { App } = await import('../../app.js');

const JWT_SECRET = 'test_secret_key';
const makeToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '1d' });

describe('Auth routes - integration', () => {
    beforeEach(() => {
        mockCreate.mockClear();
        mockLogin.mockClear();
        mockFindById.mockClear();
        mockFindById.mockRejectedValue(null);
    });

    // GET /signup
    describe('GET /signup', () => {
        test('responds with 200', async () => {
            mockFindById.mockResolvedValue(null);
            const response = await request(App).get('/signup');
            expect(response.status).toBe(200);
        });
    });

    // GET /login
    describe('GET /login', () => {
        test('responds with 200', async () => {
            mockFindById.mockResolvedValue(null);
            const response = await request(App).get('/login');
            expect(response.status).toBe(200);
        });
    });

    // POST /signup
    describe('POST /signup', () => {
        test('creates a user and returns 201 with user id', async () => {
            const fakeUser = { _id: 'abc123' };
            mockCreate.mockResolvedValue(fakeUser);

            const response = await request(App)
                .post('/signup')
                .send({ email: 'test@test.com', username: 'testuser', password: 'password123' });

            expect(response.status).toBe(201);
            expect(response.body.user).toBe('abc123');
        });

        test('sets a jwt cookie on successful signup', async () => {
            const fakeUser = { _id: 'abc123' };
            mockCreate.mockResolvedValue(fakeUser);

            const response = await request(App)
                .post('/signup')
                .send({ email: 'test@test.com', username: 'testuser', password: 'password123' });

            expect(response.headers['set-cookie']).toBeDefined();
            expect(response.headers['set-cookie'][0]).toMatch(/jwt=/);
        });

        test('returns 400 when User.create throws an error', async () => {
            mockCreate.mockRejectedValue(new Error('email already exists'));

            const response = await request(App)
                .post('/signup')
                .send({ email: 'dupe@test.com', username: 'testuser', password: 'password123' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('email already exists');
        });
    });

    // POST /login
    describe('POST /login', () => {
        test('returns 200 and user info on valid credentials', async () => {
            const fakeUser = { _id: 'user99', email: 'test@test.com', username: 'testuser' };
            mockLogin.mockResolvedValue(fakeUser);

            const response = await request(App)
                .post('/login')
                .send({ email: 'test@test.com', password: 'password123' });

            expect(response.status).toBe(200);
            expect(response.body.email).toBe('test@test.com');
            expect(response.body.username).toBe('testuser');
        });

        test('sets a jwt cookie on successful login', async () => {
            const fakeUser = { _id: 'user99', email: 'test@test.com', username: 'testuser' };
            mockLogin.mockResolvedValue(fakeUser);

            const response = await request(App)
                .post('/login')
                .send({ email: 'test@test.com', password: 'password123' });

            expect(response.headers['set-cookie']).toBeDefined();
            expect(response.headers['set-cookie'][0]).toMatch(/jwt=/);
        });

        test('returns 400 on incorrect password', async () => {
            mockLogin.mockRejectedValue(new Error('incorrect password'));

            const response = await request(App)
                .post('/login')
                .send({ email: 'test@test.com', password: 'wrongpass' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('incorrect password');
        });

        test('returns 400 on incorrect email', async () => {
            mockLogin.mockRejectedValue(new Error('incorrect email'));

            const response = await request(App)
                .post('/login')
                .send({ email: 'nobody@test.com', password: 'password123' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('incorrect email');
        });
    });

    // GET /logout
    describe('GET /logout', () => {
        test('clears the jwt cookie and redirects to /', async () => {
            const response = await request(App).get('/logout');

            expect(response.status).toBe(302);
            expect(response.headers['location']).toBe('/');
        });
    });
});