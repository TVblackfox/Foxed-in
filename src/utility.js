const bcrypt = require('bcrypt');

/**
 * Hashes a password using bcrypt with SHA-512 and a salt.
 * @param {string} password - The plaintext password to hash.
 * @returns {Promise<string>} - The hashed password.
 */
async function hashPassword(password) {
    try {
        const saltRounds = 10; // Number of salt rounds
        const salt = await bcrypt.genSalt(saltRounds); // Generate salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash password with SHA-512
        return hashedPassword;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error;
    }
}

module.exports = { hashPassword };
