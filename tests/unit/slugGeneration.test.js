// certificates slug generation 
// tests slug in isolation, without MongoDB
// test slug transformation function

// extract slug logic:
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

describe('Certificate slug generation (unit)', () => {
    test('converts a simple name to lowercase slug', () => {
        expect(generateSlug('React Course')).toBe('react-course');
    });

    test('trims leading and trailing whitespace', () => {
        expect(generateSlug('   AWS Certificate  ')).toBe('aws-certificate');
    });

    test('replaces spaces with hyphens', () => {
        expect(generateSlug('Node JS Advanced')).toBe('node-js-advanced');
    });

    test('removes special characters', () => {
        expect(generateSlug('C++ Programming!')).toBe('c-programming');
    });

    test('collapses multiple spaces/hyphens intto one hyphen', () => {
        expect(generateSlug('Hello   World')).toBe('hello-world');
    });

    test('removes leading and trailing hyphens', () => {
        expect(generateSlug('---test---')).toBe('test');
    });

    test('handles a single word', () => {
        expect(generateSlug('Docker')).toBe('docker');
    });

    test('handles mixed case input', () => {
        expect(generateSlug('MongoDB University')).toBe('mongodb-university');
    });
});