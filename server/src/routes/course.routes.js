import express from 'express';
import CourseController from '../controller/course.controller.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const courseRoutes = express.Router();

courseRoutes.route('/create').post(adminMiddleware, CourseController.createCourse);
courseRoutes.route('/update/:courseId').put(adminMiddleware, CourseController.updateCourse);
courseRoutes.route('/delete/:courseId').delete(adminMiddleware, CourseController.deleteCourse);
courseRoutes.route('/courses').get(CourseController.getAllCourse);
courseRoutes.route('/:courseId').get(CourseController.courseDetails);
courseRoutes.route('/buy/:courseId').post(authMiddleware, CourseController.buyCourse);

export default courseRoutes;
