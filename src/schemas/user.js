const mongoose = require("mongoose");
// Define the schema
const userSchema = new mongoose.Schema({
    // user_id: {type: Number, requires: true, unique: true}, // User ID
    username: { type: String, required: true, unique: true }, // Unique username
    nick: { type: String }, // Optional nickname
    password: { type: String, required: true }, // Hashed password
    createdAt: { type: Date, default: Date.now }, // Creation date
    permissions: { type: [String], default: [] }, // Array of permission strings
    badges: { type: [String], default: [] }, // Array of badge identifiers
});

const User = mongoose.model("User", userSchema);

module.exports = User;
