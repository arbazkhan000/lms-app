import express from "express";

import {
    createCourse,
    deletCourse,
    getCourse,
    updateCourse,
} from "../controller/course.controller.js";

const courseRoutes = express.Router();

courseRoutes.route("/create").post(createCourse);

courseRoutes.route("/update/:courseId").put(updateCourse);
courseRoutes.route("/delet/:courseId").delete(deletCourse);
courseRoutes.route("/find").get(getCourse);

export default courseRoutes;
