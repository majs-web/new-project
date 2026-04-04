
// Separates printing to the console to its own module
export const info = (...params) => {
    console.log(...params);
};

export const error = (params) => {
    console.error(...params);
};

