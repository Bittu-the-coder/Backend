import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
  try {
    //TODO: create tweet
    const { content } = req.body
    const { userId } = req.params
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json(new ApiError("User not found", 404))
    }
    const tweet = await Tweet.create({
      content,
      owner: userId,
    })

    return res.status(201)
      .json(
        new ApiResponse("Tweet created successfully", 201, {
          tweet,
        })
      )
  } catch (error) {
    return res.status(500).json(new ApiError("Internal server error", 500))
  }
})

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
})

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
})

export {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet
}