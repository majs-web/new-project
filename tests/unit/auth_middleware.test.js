// tests requireAuth and checkUser in isolation
// uses jest.unstable_mockModule(), bc ESM and jest 30

import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

// mock before importing the module
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

// dynamic imports
const { requireAuth, checkUser } = await import('../../middlewares/auth_middleware.js');

const JWT_SECRET = 'test_secret_key';
const validToken = jwt.sign({ id: 'user123' }, JWT_SECRET, { expiresIn: '1d' });

// helper: build mock request with optional JWT cookie
const mockRequest = (token = null) => ({
    cookies: { jwt: token }
});

// helper: build mock response with locals and spies
const mockResponse = () => {
    const response = {};
    response.locals = {};
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    return response;
};

// test: requireAuth

describe('requreAuth (unit)', () => {
    let next;

    beforeEach(() => {
        next = jest.fn();
        mockFindById.mockReset();
    });

    test('returns 401 when no token is present', () => {
        const request = mockRequest(null);
        const response = mockResponse();
        requireAuth(request, response, next);
        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith({ error: 'Not authorized' });
        expect(next).not.toHaveBeenCalled();
    });

    test('returns 401 when token is invalid', async () => {
        const request = mockRequest('invalid.token.value');
        const response = mockResponse();
        requireAuth(request, response, next);
        await new Promise(r => setTimeout(r, 200));
        expect(response.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test('calls next() and sets response.locals.user when token is valid', async () => {
        const fakeUser = { _id: 'user123', username: 'testuser' };
        mockFindById.mockResolvedValue(fakeUser);

        const request = mockRequest(validToken);
        const response = mockResponse();
        requireAuth(request, response, next);

        await new Promise(r => setTimeout(r, 200));

        expect(mockFindById).toHaveBeenCalledWith('user123');
        expect(response.locals.user).toBe(fakeUser);
        expect(next).toHaveBeenCalled();
    });

    test('calls next() even when user is not found in DB (known bug)', async () => {
        // documents bug, still calls next() with locals.user = null
        mockFindById.mockResolvedValue(null);

        const request = mockRequest(validToken);
        const response = mockResponse();
        requireAuth(request, response, next);

        await new Promise(r => setTimeout(r, 200));

        expect(response.locals.user).toBeNull();
        expect(next).toHaveBeenCalled(); // bug should return 401
    });
});

// test: checkUser

describe('checkUser (unit)', () => {
    let next;

    beforeEach(() => {
        next = jest.fn();
        mockFindById.mockReset();
    });

    test('sets user to null and calls next() when no token', async () => {
        const request = mockRequest(null);
        const response = mockResponse();
        checkUser(request, response, next);
        await new Promise(r => setTimeout(r, 200));
        expect(response.locals.user).toBeNull();
        expect(next).toHaveBeenCalled();
    });

    test('sets user to null and calls next() when token is invalid', async () => {
        const request = mockRequest('bad.token');
        const response = mockResponse();
        checkUser(request, response, next);
        await new Promise(r => setTimeout(r, 200));
        expect(response.locals.user).toBeNull();
        expect(next).toHaveBeenCalled();
    });

    test('sets response.locals.user and calls next() when token is valid', async () => {
        const fakeUser = { _id: 'user123', username: 'testuser' };
        mockFindById.mockResolvedValue(fakeUser);

        const request = mockRequest(validToken);
        const response = mockResponse();
        checkUser(request, response, next);

        await new Promise(r => setTimeout(r, 200));

        expect(response.locals.user).toBe(fakeUser);
        expect(next).toHaveBeenCalled();
    });

    test('sets user to null if DB returns null', async () => {
        mockFindById.mockResolvedValue(null);

        const request = mockRequest(validToken);
        const response = mockResponse();
        checkUser(request, response, next);

        await new Promise(r => setTimeout(r, 200));

        expect(response.locals.user).toBeNull();
        expect(next).toHaveBeenCalled();
    });
});