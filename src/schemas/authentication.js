const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Define the schema
const authTokenSchema = new Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true, // Ensure tokens are unique
        },
        user_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "users", // Reference to the User model
        },
        expiresAt: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create the model
const AuthToken = model("AuthToken", authTokenSchema);

module.exports = AuthToken;
