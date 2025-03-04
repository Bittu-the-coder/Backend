import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { fs } from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new Error("File path is required")
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded
    console.log("File uploaded successfully on cloudinary", response.url);
    return response;

  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the local file as the file upload failed
    console.error(error);
  }
}

export { uploadOnCloudinary }