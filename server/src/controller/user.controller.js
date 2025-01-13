import bcrypt from "bcryptjs";
import User from "../model/user.schema.js";
import { ApiResponse } from "../utils/ErrorHandler.js";
import asyncHandler from "../utils/asyncHandler.js";
import { authValidation } from "../utils/auth.validator.js";
import { generateToken } from "../utils/generateToken.js";

const userRegister = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return ApiResponse.error(res, "All field are required", 404);
    }

    const validateData = authValidation.safeParse(req.body);

    if (!validateData.success) {
        return res.status(400).json({
            errors: validateData.error.issues.map((err) => err.message),
        });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return ApiResponse.error(
            res,
            "User with this email already exists",
            400
        );
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 8);

    const newUserData = {
        name,
        email,
        password: hashPassword,
    };

    // Create a new user
    const createdUser = await User.create(newUserData);
    const token = generateToken({ id: createdUser._id });

    return ApiResponse.created(
        res,

        { token },
        "User created successfully"
    );
});

const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return ApiResponse.error(res, "All fields are required", 404);
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
        return ApiResponse.error(404, "User not found with this email", 400);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return ApiResponse.error(res, "Invalid credentials", 401);
    }

    // Generate token
    const token = generateToken({ id: user._id });
   
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return ApiResponse.success(res, { token }, `User logged in ${user.name}`);
});

const userLogout = asyncHandler(async (req, res) => {
    if (!req.cookies.token) {
        return ApiResponse.success(res, {}, "No active session found");
    }
    res.clearCookie("token");
    return ApiResponse.success(res, "User  logged out successfully");
});

const userProfile = asyncHandler(async (req, res) => {
    const user = req.user; // Retrieved from authMiddleware
    if (!user) {
        return ApiResponse.error(res, "User not found", 404);
    }
    return ApiResponse.success(
        res,
        { id: user._id, name: user.name, email: user.email },
        "User profile retrieved successfully"
    );
});

export { userLogin, userLogout, userProfile, userRegister };
