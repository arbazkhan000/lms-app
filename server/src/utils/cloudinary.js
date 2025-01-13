import { v2 as cloudinary } from "cloudinary";
import fs from "fs";



export const fileUpload = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
        });
        console.log("File uploaded successfully:", result);
        return result;
    } catch (error) {
        fs.unlinkSync(filePath);
    }
};
