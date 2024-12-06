module.exports = [
    {
        files: ["**/*.js"], // Target all JavaScript files
        languageOptions: {
            ecmaVersion: "latest", // Enable the latest ECMAScript features
            sourceType: "module", // Use ECMAScript modules
            globals: {
                // Define global variables
                require: "readonly",
                module: "readonly",
                process: "readonly",
                __dirname: "readonly",
                console: "readonly"
            }
        },
        rules: {
            "semi": ["error", "always"],
            "quotes": ["error", "double"],
            "indent": ["error", 4],
            "no-console": "off",
            "no-unused-vars": ["warn"],
            "eqeqeq": ["error", "always"],
            "curly": "error"
        }
    }
];
  