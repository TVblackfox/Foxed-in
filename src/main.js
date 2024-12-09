require("dotenv").config();
const express = require("express");
const database = require("./database");
const { hashPassword } = require("./utility");

// Import the User schema or constructor
const { User } = require("./schemas/user");

// Basic server configuration
const app = express();
const PORT = process.env.PORT || -1;
const HOST = process.env.HOST || -1;

if (PORT === -1 || HOST === "") {
    console.error("ERROR! The port (or host) wasn't given in the .env file. Perhaps you forgot to create a copy of the selected .env template and (or) rename it to the .env?\n");
    process.exit(1);
}

app.use(express.static("src/public"));

(async () => {
    try {
        // Ensure the database connection is established
        console.log("INFO: Connecting to the database...");
        const db = await database.connectToDatabase();
        console.log("SUCCESS: Connected to the database.");

        // Check if the admin account exists
        console.log("Checking if an admin account exists.");
        const adminExists = await database.doesUserExist({ username: "admin" });

        if (!adminExists) {
            console.log("An admin account doesn't exist. Creating one.");
            const adminPassword = await hashPassword("123456789"); // Hash the admin password securely
            const adminUser = {
                username: "admin",
                nick: "Foxed-In Admin",
                password: adminPassword,
                createdAt: new Date(),
                permissions: ["administrator"],
                badges: ["administrator", "developer", "owner"],
            };

            await database.createUser(adminUser);
            console.log("SUCCESS: Admin account created.");
        } else {
            console.log("Admin account already exists.");
        }

        // Start the server after the database is ready
        app.listen(PORT, HOST, () => {
            const protocol = PORT === 443 ? "https" : "http";
            const portPart = PORT === 80 || PORT === 443 ? "" : `:${PORT}`;
            console.log(`SUCCESS! The server is running. Visit: ${protocol}://${HOST}${portPart}`);
        });
    } catch (error) {
        console.error("ERROR: Unable to start the server due to an issue with the database:", error);
        process.exit(1); // Exit the application if the database connection fails
    }
})();
