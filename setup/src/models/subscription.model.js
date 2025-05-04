import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  subscriber: {
    type: Schema.Types.ObjectId, // one who is subscribing
    ref: "User",
  },
  channel: {
    type: Schema.Types.ObjectId, // channel to which he is subscribing
    ref: "User",
  }
}, { timestamps: true });