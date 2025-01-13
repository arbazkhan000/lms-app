import express from "express";
import {
    userLogin,
    userLogout,
    userProfile,
    userRegister,
} from "../controller/user.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const userRoutes = express.Router();

userRoutes.route("/create").post(userRegister);
userRoutes.route("/login").post(authMiddleware, userLogin);
userRoutes.route("/logout").post(authMiddleware,userLogout);
userRoutes.route("/profile").get(authMiddleware,userProfile);

export default userRoutes;
