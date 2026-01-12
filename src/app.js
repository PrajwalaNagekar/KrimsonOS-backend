import express from 'express';
import cors from 'cors';
import { ApiError } from './utils/ApiError.js';
import userRouter from './modules/users/routes/user.routes.js';

const app = express();

// Global Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Register Routes
app.use("/api/v1/users", userRouter);

// Root route for health check
app.get("/", (req, res) => {
    res.json({ message: "Krimson OS API is running" });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined
        });
    }

    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});

export { app };
