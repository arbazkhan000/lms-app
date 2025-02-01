import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_UR,
        credentials: true,
    })
);
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
    })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong' });
});

//routes import
import courseRoutes from './routes/course.routes.js';
import userRoutes from './routes/user.routes.js';

// routes

app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/auth', userRoutes);

export { app };
