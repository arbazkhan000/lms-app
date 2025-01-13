import cors from "cors";
import express from "express";
import fileUpload from 'express-fileupload';
import cookieParser from "cookie-parser"; 



const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong" });
});

//routes import
import courseRoutes from "./routes/course.routes.js";
import userRoutes from './routes/user.routes.js'


// routes

app.use("/api/v1",courseRoutes);
app.use("/api/v1/auth", userRoutes);

export { app };
