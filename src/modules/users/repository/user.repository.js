import { User } from '../models/user.model.js';
import { ApiError } from '../../../utils/ApiError.js';
import mongoose from 'mongoose';

const findByUsernameOrEmail = async (username, email) => {
    try {
        return await User.findOne({
            $or: [{ username }, { email }]
        });
    } catch (err) {
        if (err instanceof ApiError) throw err;
        throw new ApiError(500, "Failed to fetch user by username or email");
    }
};

const findById = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, "Invalid user ID");
        }
        return await User.findById(id);
    } catch (err) {
        if (err instanceof ApiError) throw err;
        throw new ApiError(500, "Failed to fetch user by ID");
    }
};

const create = async (userData) => {
    try {
        return await User.create(userData);
    } catch (err) {
        if (err.name === "ValidationError") {
            throw new ApiError(400, err.message);
        }
        if (err instanceof ApiError) throw err;
        throw new ApiError(500, "Failed to create user");
    }
};

const findByIdAndUpdate = async (id, updateData, options = { new: true }) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, "Invalid user ID");
        }
        return await User.findByIdAndUpdate(id, updateData, options);
    } catch (err) {
        if (err.name === "ValidationError") {
            throw new ApiError(400, err.message);
        }
        if (err instanceof ApiError) throw err;
        throw new ApiError(500, "Failed to update user");
    }
};

export default {
    findByUsernameOrEmail,
    findById,
    create,
    findByIdAndUpdate
};
