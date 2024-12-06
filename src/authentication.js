const { v4: uuidv4 } = require("uuid");
const { db, ObjectId } = require("./database"); // Import the shared db instance

let authTokensCollection;

/**
 * Initialize the auth_tokens collection.
 * Ensures the collection is set up properly.
 */
function initializeAuthTokensCollection() {
    if (!authTokensCollection) {
        authTokensCollection = db.collection("auth_tokens");
        console.log("INFO: Initialized 'auth_tokens' collection.");
    }
}

/**
 * Create an authentication token for a user.
 * @param {ObjectId} userId - The user's ID.
 * @returns {Promise<Object>} - The created token document.
 */
async function createAuthToken(userId) {
    initializeAuthTokensCollection();

    const token = uuidv4(); // Generate a random token (UUID)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    const authToken = { token, user_id: ObjectId(userId), expiresAt };

    await authTokensCollection.insertOne(authToken);
    console.log("Authentication token created:", authToken);

    return authToken;
}

/**
 * Validate a token by checking its existence and expiry.
 * @param {string} token - The token string.
 * @returns {Promise<Object|null>} - The valid token document or null if invalid.
 */
async function validateAuthToken(token) {
    initializeAuthTokensCollection();

    const authToken = await authTokensCollection.findOne({
        token,
        expiresAt: { $gt: new Date() }, // Ensure the token is not expired
    });

    return authToken;
}

/**
 * Delete a token (e.g., for logout).
 * @param {string} token - The token string.
 * @returns {Promise<boolean>} - True if the token was deleted, false otherwise.
 */
async function deleteAuthToken(token) {
    initializeAuthTokensCollection();

    const result = await authTokensCollection.deleteOne({ token });
    return result.deletedCount > 0;
}

/**
 * Clean up expired tokens from the collection.
 * This can be run periodically.
 */
async function cleanExpiredTokens() {
    initializeAuthTokensCollection();

    const result = await authTokensCollection.deleteMany({
        expiresAt: { $lt: new Date() },
    });
    console.log("Deleted expired tokens:", result.deletedCount);
}

module.exports = {
    createAuthToken,
    validateAuthToken,
    deleteAuthToken,
    cleanExpiredTokens,
};
