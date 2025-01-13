// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ErrorHandler.js";
import User from "../model/user.schema.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
   

    if (!token) {
        return ApiResponse.error(
            res,
            "No token provided. Authentication failed.",
            401
        );
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
       
        
        req.user = decoded;
        next();
    } catch (error) {
        return ApiResponse.error(res, "Invalid or expired token", 401);
    }
});

export default authMiddleware;
