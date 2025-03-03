// require('dotenv').config({path: "./env"})

import dotenv from "dotenv"

import mongoose from "mongoose"
import { DB_NAME } from "./constants.js";
import { connectDB } from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env"
})

connectDB()
  .then(() => app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${process.env.PORT || 8000}`)
  }))
  .catch((err) => console.error("Error connecting to MongoDB:", err))

/*
import express from "express"
const app = express();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("err", (err) => {
      console.error(err);
      throw err
    })
    app.listen(process.env.PORT, () => {
      console.log(`Example app listening on port http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
    throw err
  }
})() */