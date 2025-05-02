import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

  return res.status(201).json(
    new ApiResponse(201, "User created successfully", createdUser)
  );
});

export { registerUser }