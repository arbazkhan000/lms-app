import express from 'express';
import UserController from '../controller/user.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const userRoutes = express.Router();

userRoutes.route('/create').post(UserController.userRegister);
userRoutes.route('/login').post(UserController.userLogin);
userRoutes.route('/profile').get(authMiddleware, UserController.userProfile);
userRoutes.route('/logout').post(authMiddleware, UserController.userLogout);

export default userRoutes;
