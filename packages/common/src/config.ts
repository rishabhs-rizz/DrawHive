import dotenv from "dotenv";
dotenv.config();

// Loads .env variables into process.env

// Now you can use them
console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);

const JWT_SECRET = process.env.JWT_SECRET || "123123";

console.log("JWT_SECRET:", JWT_SECRET);

export default JWT_SECRET;
