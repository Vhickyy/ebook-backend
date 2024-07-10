import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import appConfig from "./app.js";
import connectDB from "./config/db.js";
import cors from "cors"

const app = express();

app.use(express.json());
app.use(cors({
    origin: ["https://warm-book.vercel.app"]
}))
// app.use(cors({
//     origin: [process.env.FRONTEND,process.env.LOCAL]
// }))

const port = process.env.PORT || 8000;

const server = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        })
        appConfig(app)
    } catch (error) {
        process.exit(1)
    }
}

server();



