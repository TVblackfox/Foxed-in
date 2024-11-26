const express = require("express")
require("dotenv").config() // Configure the dotenv and parse the .env

// basic server configuration
const app = express(); 
const PORT = process.env.PORT || -1;
const HOST = process.env.HOST || -1;

if (PORT == -1 || HOST == "") {
    console.error("ERROR! The port (or host) wasn't given in the .env file. Perhaps you forgot to create a copy of the selected .env template and (or) rename it to the .env?\n");
    process.exit(1);
}

app.use(express.static("src/public"));

app.listen(PORT, HOST, () => {
    if (PORT == 80) {
        console.log(`SUCCESS! The server is successfully began to run. Visit: http://${HOST}\n`);
    } else if (PORT == 443) {
        console.log(`SUCCESS! The server is successfully began to run. Visit: https://${HOST}\n`);
    } else {
        console.log(`SUCCESS! The server is successfully began to run. Visit: http://${HOST}:${PORT} or if that didn't work: https://${HOST}:${PORT}\n`);
    }
});
