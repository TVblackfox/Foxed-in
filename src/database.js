const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGO_URI || "?";

if (uri === "?")
{
    console.error("ERROR! MongoDB URI hasn't been set.\n");
    process.exit(1);
}

const mongo_client = new MongoClient(uri);

let usersCollection, db;

async function connectToDatabase()
{
    try {
        await mongo_client.connect();
        console.log("INFO: Connected to MongoDB instance.");
    
        const database = mongo_client.db("FoxedIn");

        usersCollection = database.collection("users");

        db = database;
        return database;
    } catch(error) {
        console.error("Error while connecting to MongoDB: ", error);
        process.exit(1);
    }
}


/**
 * Create a new user.
 * @param {Object} userData - User data object containing username, nick, password, permissions, and badges.
 */
async function createUser(userData) {
    const user = {
        ...userData,
        user_id: new ObjectId(), // Generate a unique user ID
        createdAt: new Date(), // Set creation date
    };

    const result = await usersCollection.insertOne(user);
    console.log("User created with ID:", result.insertedId);
    return user;
}

/**
 * Delete a user by ID or username.
 * @param {Object} identifier - The identifier for the user (user_id or username).
 */
async function deleteUser(identifier) {
    let filter;

    if (identifier.user_id) {
        filter = { user_id: new ObjectId(identifier.user_id) };
    } else if (identifier.username) {
        filter = { username: identifier.username };
    } else {
        throw new Error("You must provide either a user_id or username.");
    }

    const result = await usersCollection.deleteOne(filter);
    console.log("Deleted count:", result.deletedCount);
    return result.deletedCount > 0;
}

/**
 * Find a user by ID or username.
 * @param {Object} identifier - The identifier for the user (user_id or username).
 */
async function findUser(identifier) {
    let filter;

    if (identifier.user_id) {
        filter = { user_id: new ObjectId(identifier.user_id) };
    } else if (identifier.username) {
        filter = { username: identifier.username };
    } else {
        throw new Error("You must provide either a user_id or username.");
    }

    const user = await usersCollection.findOne(filter);
    console.log("Found user:", user);
    return user;
}

/**
 * Find users by similar usernames or nicks (case-insensitive search).
 * @param {Object} searchParams - Search parameters (username or nick).
 */
async function findUsers(searchParams) {
    const { username, nick } = searchParams;
    const filter = {};

    if (username) {
        filter.username = { $regex: username, $options: "i" }; // Case-insensitive regex
    }
    if (nick) {
        filter.nick = { $regex: nick, $options: "i" }; // Case-insensitive regex
    }

    const users = await usersCollection.find(filter).toArray();
    console.log("Found users:", users);
    return users;
}

/**
 * Check if a user exists by username or user_id.
 * @param {Object} identifier - The identifier for the user (user_id or username).
 * @returns {boolean} - True if user exists, false otherwise.
 */
async function doesUserExist(identifier) {
    let filter;

    if (identifier.user_id) {
        filter = { user_id: new ObjectId(identifier.user_id) };
    } else if (identifier.username) {
        filter = { username: identifier.username };
    } else {
        throw new Error("You must provide either a user_id or username.");
    }

    const user = await usersCollection.findOne(filter);
    return user !== null;
}

module.exports = { connectToDatabase, createUser, deleteUser, findUser, findUsers, doesUserExist, db };