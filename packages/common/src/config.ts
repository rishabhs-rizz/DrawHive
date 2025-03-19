import * as dotenv from "dotenv";
dotenv.config();

// Loads .env variables into process.env

// Now you can use them
const JWT_SECRET = process.env.JWT_SECRET;

console.log("JWT_SECRET:", JWT_SECRET);

export default JWT_SECRET;
