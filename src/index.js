// require('dotenv').config({path: './env'})

import dotenv from 'dotenv';

import connectDB from './db/index.js';
dotenv.config({
    path: './env'
})


// Method 2 f writing code in DB folder and export from there and import here

connectDB()
.then(() =>{
    app.listen(process.env.PORT || 8000, () =>{
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) =>{
    console.log("MONGO DB connection failed !!!", err);
})

// error listemner for the app
// Error listener for the app
// app.on("error", (error) => {
//     console.log("App Error: ", error);
//     throw error;
// });











/*
import express from "express"

const app = express();

// Approach 1 of writing code in index.js 

// data base connection using ephis concept of javascript
( async () => {
    
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

        // Listenr -> data base to connect ho gya hai but app baat nii kr paa rhi hai
        app.on("error", (error) =>{
            console.log("Error: ", error);
            throw error;
        })

        app.listen(process.env.PORT, () =>{
            console.log(`App is Listening on port ${process.env.PORT}`);

        })
    } catch(error){
        console.error("Error: ", error);
        throw error
    }
})()

*/