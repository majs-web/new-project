// tests token creation logic in auth_controller in isolation
// re-implement createToken
// test the jwt.sign / jwt.verify contract directly

import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'test_secret_key';
const maxAge = 3 * 24 * 60 * 60; // 3 days

// Re-implementation of the pricate createToken function
const createToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: maxAge });
};

describe('createToken (unit)', () => {
    test('returns a string', () => {
        const token = createToken('abc123');
        expect(typeof token).toBe('string');
    });

    test('token has three JWT parts separatedd by dots', () => {
        const token = createToken('abc123');
        const parts = token.split('.');
        expect(parts).toHaveLength(3);
    });

    test('decoded token contains the correct user id', () => {
        const userId = 'user_id_42';
        const token = createToken(userId);
        const decoded = jwt.verify(token, JWT_SECRET);
        expect(decoded.id).toBe(userId);
    });

    test('decoded token contains an expiry field', () => {
        const token = createToken('abc123');
        const decoded = jwt.verify(token, JWT_SECRET);
        expect(decoded.exp).toBeDefined();
    });

    test('token expires after the expected duration (3 days)', () => {
        const token = createToken('abc123');
        const decoded = jwt.verify(token, JWT_SECRET);
        const expectedExpiry = decoded.iat + maxAge;
        expect(decoded.exp).toBe(expectedExpiry);
    });

    test('token signed with wrong secret fails verification', () => {
        const token = createToken('abc123');
        expect(() => jwt.verify(token, 'wrong_secret')).toThrow();
    });

    test('different user ids produce different tokens', () => {
        const token1 = createToken('user1');
        const token2 = createToken('user2');
        expect(token1).not.toBe(token2);
    });
});