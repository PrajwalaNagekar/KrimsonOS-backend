import mongoose from 'mongoose';
import { ROLES } from '../../../shared/constants/roles.js';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        enum: Object.values(ROLES),
        default: ROLES.STUDENT
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String, // cloudinary url
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
