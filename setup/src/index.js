// require('dotenv').config({path: "./env"})

import dotenv from "dotenv"

import mongoose from "mongoose"
import { DB_NAME } from "./constants.js";
import { connectDB } from "./db/index.js";

dotenv.config({
  path: "./env"
})

connectDB()

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