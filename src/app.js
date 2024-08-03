import express from "express"

import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());



// Routes import
import userRouter from "./routes/user.routes.js"

// Routes declaration
// aise jab hm sath me routes likte hai then app.get use krte hai
// yha p hm routes kko exxport kr rhe hai so we use app.use
app.use("/api/v1/users", userRouter);
// http://localhost:8000/api/v1/users/register


export { app }