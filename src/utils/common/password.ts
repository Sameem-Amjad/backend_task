import bcrypt from 'bcryptjs';

const saltRounds = 10;

/*
 * Hash a password using bcrypt.
 * @param {string} password - The password to hash.
 * @returns {string} The hashed password.
 */
export const hashPassword = async (password: any) => {
    return await bcrypt.hash(password, saltRounds);
};

/*
 * Compare a plain text password with a hashed password.
 * @param {string} password - The plain text password.
 * @param {string} hashedPassword - The hashed password.
 * @returns {boolean} True if the passwords match, otherwise false.
 */
export const comparePassword = async (password: any, hashedPassword: any) => {
    return await bcrypt.compare(password, hashedPassword);
};
