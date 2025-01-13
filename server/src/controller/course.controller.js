import { v2 as cloudinary } from "cloudinary";
import Course from "../model/course.schema.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ErrorHandler.js";

// Initialize Cloudinary Configuration once
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

console.log("Cloudinary Config Check:", {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_SECRET_KEY,
});

const createCourse = asyncHandler(async (req, res) => {
    try {
        console.log("Request body:", req.body);

        const { title, description, price } = req.body;

        if (!title || !description || !price) {
            console.log("Validation failed: Missing fields");
            return ApiResponse.error(res, "All fields are required", 400);
        }

        if (isNaN(price) || price <= 0) {
            console.log("Validation failed: Invalid price");
            return ApiResponse.error(
                res,
                "Price must be a positive number",
                400
            );
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            console.log("Validation failed: No file uploaded");
            return ApiResponse.error(res, "No file uploaded", 400);
        }

        const { image } = req.files;
        console.log("Image metadata:", image);

        const allowedFormats = ["image/png", "image/jpeg"];
        if (!allowedFormats.includes(image.mimetype)) {
            console.log("Validation failed: Invalid file format");
            return ApiResponse.error(
                res,
                "Invalid file format. Only JPEG and PNG allowed",
                400
            );
        }

        // Cloudinary Upload
        console.log("Uploading image to Cloudinary...");
        const uploadResult = await cloudinary.uploader.upload(
            image.tempFilePath
        );
        console.log("Cloudinary upload result:", uploadResult);

        if (!uploadResult || uploadResult.error) {
            console.error("Cloudinary error:", uploadResult.error);
            return ApiResponse.error(res, "Failed to upload image", 500);
        }

        // Create course data
        const courseData = {
            title,
            description,
            price,
            image: {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url,
            },
        };
        console.log("Creating course:", courseData);

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
        image: {
            public_id: uploadResult.public_id,
            url: uploadResult.secure_url,
        },
    };
    const updateCourse = await Course.updateOne(
        { _id: courseId },
        updateCourseData
    );
    console.log("Course updated:", updateCourse);
    return ApiResponse.ok(res, "Course updated successfully");
});

const deletCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const course = await Course.findByIdAndDelete({ _id: courseId });

    if (!course) {
        return ApiResponse.error(res, "Course not found", 404);
    }

    return ApiResponse.ok(res, "Course Delet successfully");
});

const getCourse = asyncHandler(async (req, res) => {
    const course = await Course.find();

    if (!course) {
        return ApiResponse.error(res, "Course not found", 404);
    }

    return ApiResponse.success(res, "Course find");
});

export { createCourse, deletCourse, updateCourse,getCourse };
