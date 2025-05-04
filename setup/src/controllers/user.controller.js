import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  // Get user data from request body
  // validate user data - check if user already exists or not
  // check for img files, check for avatar and cover photo
  // upload them to cloudinary
  // Create user object - crete user in database
  // remove password reference token from user object
  // return user data and token


  const { fullName, username, email, password } = req.body;
  console.log(fullName, username, email, password);

  if ([fullName, username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  } else if (typeof password !== "string" || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  } else if (username.length < 3) {
    throw new Error("Username must be at least 3 characters");
  } else if (!email.includes("@") || email.length < 5) {
    throw new Error("Invalid email address");
  }

  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    throw new ApiError(409, "User already exists");
  }

  // Validate files exist
  const avatarLocalPath = req.files?.["avatar"]?.[0]?.path;
  const coverImageLocalPath = req.files?.["coverImage"]?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Upload to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar file upload failed");
  }

  let coverImage;
  if (coverImageLocalPath) {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
  }

  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken").then((user) => {
    res.status(201).json({ user });
  });

  // return res.status(201).json(
  //   new ApiResponse(201, "User created successfully", createdUser)
  // );
  return createdUser;
});


const loginUser = asyncHandler(async (req, res) => {
  // Login user logic here
  // req body = { email, password }
  // username or email
  // check if user exists
  // check if password is correct
  // generate tokens
  // return user data and token
  // send cookie

  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or Email is required")
  }

  // for both if(!(username || email))

  const user = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(
      400, "Incorrect user credentials"
    )
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser, accessToken, refreshToken
      },
      "User logged in Successfully"
    )
  )
});

const logoutUser = asyncHandler(async (req, res) => {
  // clear cookies
  // remove refresh token from user
  // return success message
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }
  return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {},
      "User logged out"
    )
    )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  // get refresh token from cookies
  // verify refresh token
  // generate new access token
  // return new access token
  try {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request")
    };

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    if (!user) {
      throw new ApiError(401, "Invalid refresh token")
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid refresh token")
    }

    const options = {
      httpOnly: true,
      secure: true
    }

    const { newAccessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)
    return res.status(200)
      .cookie("accessToken", newAccessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(200, { newAccessToken, newRefreshToken }, "Access token refreshed")
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")

  }
})


export { registerUser, loginUser, logoutUser, refreshAccessToken }