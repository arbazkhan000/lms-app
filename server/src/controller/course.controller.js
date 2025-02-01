import Course from '../model/course.schema.js';
import Purchase from '../model/purchase.schema.js';
import cloudinary from '../utils/cloudinary.js';

const CourseController = {
    createCourse: async (req, res) => {
        try {
            const { title, description, price } = req.body;

            // Validate input fields
            if (!title || !description || !price) {
                return res.status(400).json({ message: 'All fields are required', success: false });
            }

            if (isNaN(price) || price <= 0) {
                return res
                    .status(400)
                    .json({ message: 'Price must be a positive number', success: false });
            }

            if (!req.files || !req.files.image) {
                return res.status(400).json({ message: 'No file uploaded', success: false });
            }

            const image = req.files.image; // Get the uploaded file

            // Allowed image formats
            const allowedFormats = ['image/png', 'image/jpeg'];
            if (!allowedFormats.includes(image.mimetype)) {
                return res.status(400).json({
                    message: 'Invalid file format. Only PNG and JPEG are allowed.',
                    success: false,
                });
            }

            // Upload to Cloudinary
            const cloudResponse = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: 'courses', // Optional: Store inside a folder in Cloudinary
            });

            if (!cloudResponse || cloudResponse.error) {
                return res
                    .status(500)
                    .json({ message: 'Error uploading file to Cloudinary', success: false });
            }

            // Create course in MongoDB
            const course = await Course.create({
                title,
                description,
                price,
                image: {
                    publicId: cloudResponse.public_id, // Corrected from publicId
                    url: cloudResponse.secure_url,
                },
            });

            return res.status(201).json({
                message: 'Course created successfully',
                success: true,
                data: course,
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Internal Server Error',
                error: error.message,
                success: false,
            });
        }
    },
    updateCourse: async (req, res) => {
        const { courseId } = req.params;
        const { title, description, price } = req.body;

        try {
            // Find the existing course
            const existingCourse = await Course.findById({_id:courseId});
            if (!existingCourse) {
                return res.status(404).json({ message: 'Course not found', success: false });
            }

            console.log('existingCourse:', existingCourse);

            let updatedImage = existingCourse.image; // Default to existing image

            // Check if a new image is uploaded
            if (req.files && req.files.image) {
                const image = req.files.image;

                // Validate image format
                const allowedFormats = ['image/png', 'image/jpeg'];
                if (!allowedFormats.includes(image.mimetype)) {
                    return res.status(400).json({
                        message: 'Invalid file format. Only PNG and JPEG are allowed.',
                        success: false,
                    });
                }

                // Delete old image from Cloudinary
                if (existingCourse.image.publicId) {
                    await cloudinary.uploader.destroy(existingCourse.image.publicId);
                }

                // Upload new image to Cloudinary
                const cloudResponse = await cloudinary.uploader.upload(image.tempFilePath, {
                    folder: 'courses', // Store inside a 'courses' folder
                });

                updatedImage = {
                    publicId: cloudResponse.public_id,
                    url: cloudResponse.secure_url,
                };
            }

            // Update the course in MongoDB
            const updatedCourse = await Course.findByIdAndUpdate(
                courseId,
                {
                    title,
                    price,
                    description,
                    image: updatedImage,
                },
                { new: true }
            );

            res.status(200).json({
                message: 'Course updated successfully',
                success: true,
                data: updatedCourse,
            });
        } catch (error) {
            console.error('Error updating course:', error);
            return res.status(500).json({
                message: 'Internal Server Error',
                error: error.message,
                success: false,
            });
        }
    },
    deleteCourse: async (req, res) => {
    const { courseId } = req.params;

    try {
        if (!courseId) {
            return res.status(400).json({ message: 'CourseId is required', success: false });
        }

        const deletedCourse = await Course.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found', success: false });
        }

        return res.status(200).json({
            message: 'Course Deleted Successfully',
            success: true,
            data: deletedCourse,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
            success: false,
        });
    }
},


    getAllCourse: async (req, res) => {
    try {
        const courses = await Course.find();

        if (courses.length === 0) {
            return res.status(404).json({
                message: 'No courses available',
                success: false,
            });
        }

        return res.status(200).json({
            message: 'Courses retrieved successfully',
            success: true,
            data: courses,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
            success: false,
        });
    }
},

    courseDetails: async (req, res) => {
        const { courseId } = req.params;

        try {
            if (!courseId) {
                return res.status(400).json({
                    message: 'CourseId is required',
                    success: false,
                });
            }

            const courseInfo = await Course.findById({ _id: courseId });

            if (!courseInfo) {
                return res.status(400).json({
                    message: 'Course details not found',
                    success: false,
                });
            }

            return res.status(200).json({
                message: 'Course details Successfully ',
                data: courseInfo,
                success: true,
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Internl Server Error',
                error: error.message,
                success: false,
            });
        }
    },

    buyCourse: async (req, res) => {
    const { courseId } = req.params;

    try {
        if (!req.user._id) {
            return res.status(401).json({
                message: 'Please login!',
                success: false,
            });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: 'Course not found',
                success: false,
            });
        }

        // Add course to user's purchasedCourses
        await User.findByIdAndUpdate(req.user._id, {
            $push: { purchasedCourses: courseId },
        });

        return res.status(200).json({
            message: 'Course purchased successfully!',
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
            success: false,
        });
    }
},

};

export default CourseController;
