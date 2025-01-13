import Course from "../model/course.schema.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ErrorHandler.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const createCourse = asyncHandler(async (req, res) => {
    try {
        const { title, description, price } = req.body;
        console.log(title, description, price);

        // Validate input fields
        if (!title || !description || !price) {
            return ApiResponse.error(res, "All fields are required", 400);
        }

        if (isNaN(price) || price <= 0) {
            return ApiResponse.error(
                res,
                "Price must be a positive number",
                400
            );
        }

        // // Check for uploaded file
        // if (!req.files || !req.files.image) {
        //     return ApiResponse.error(res, "No file uploaded", 400);
        // }

        // const { image } = req.files;

        // Validate file format
        // const allowedFormats = ["image/png", "image/jpeg"];
        // if (!allowedFormats.includes(image.mimetype)) {
        //     return ApiResponse.error(
        //         res,
        //         "Invalid file format. Only PNG and JPG are allowed",
        //         400
        //     );
        // }

        // Upload to Cloudinary
        // const cloudResponse = await cloudinary.uploader.upload(
        //     image.tempFilePath
        // );
        // if (!cloudResponse || cloudResponse.error) {
        //     return ApiResponse.error(
        //         res,
        //         "Error uploading file to Cloudinary",
        //         500
        //     );
        // }

        // Create course in MongoDB
        const courseData = {
            title,
            description,
            price,
           
        };

        const course = await Course.create(courseData);
        console.log("Course created:", course);

        return ApiResponse.created(res, course, "Course created successfully");
    } catch (error) {
        console.error("Error in createCourse function:", error.message);
        return ApiResponse.error(
            res,
            "An error occurred while creating the course",
            500
        );
    }
});

export default createCourse;

const updateCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    if (!courseId) {
        return ApiResponse.error(res, "Course ID is required", 400);
    }

    const { title, description, price, image } = req.body;

    const updateCourseData = {
        title,
        description,
        price,
        // image: {
        //     public_id: uploadResult.public_id,
        //     url: uploadResult.secure_url,
        // },
    };
    const updateCourse = await Course.updateOne(
        { _id: courseId },
        updateCourseData
    );
    console.log("Course updated:", updateCourse);
    return ApiResponse.success(res, "Course updated successfully");
});

const deletCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const course = await Course.findByIdAndDelete({ _id: courseId });

    if (!course) {
        return ApiResponse.error(res, "Course not found", 404);
    }

    return ApiResponse.success(res, "Course Delet successfully");
});

const getCourse = asyncHandler(async (req, res) => {
    const course = await Course.find();

    if (!course) {
        return ApiResponse.error(res, "Course not found", 404);
    }

    return ApiResponse.success(res, "Course find");
});
export { createCourse, deletCourse, getCourse, updateCourse };

// export { createCourse, deletCourse, getCourse, updateCourse };
