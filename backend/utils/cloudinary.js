import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        
        // 1. Upload the file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        
        // 2. Safely attempt to delete the temporary local file
        try {
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
        } catch (cleanupError) {
            console.log("Notice: Could not delete local file:", cleanupError.message);
        }
        
        return response;

    } catch (error) {
        // Safely attempt to delete the local file on error
        try {
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
        } catch (cleanupError) {
            console.log("Notice: Could not delete local file:", cleanupError.message);
        }

        console.log("Cloudinary File Upload Error:", error.message);
        return null;
    }
}

export default uploadOnCloudinary;