import userRepository from '../repository/user.repository.js';
import { ApiError } from '../../../utils/ApiError.js';

const registerUser = async (userData) => {
    try {
        const { fullName, email, username, password, role } = userData;

        const existedUser = await userRepository.findByUsernameOrEmail(username, email);

        if (existedUser) {
            throw new ApiError(409, "User with email or username already exists");
        }

        const user = await userRepository.create({
            fullName,
            email,
            password,
            username,
            role
        });

        const createdUser = await userRepository.findById(user._id);

        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while registering the user");
        }

        const userResponse = createdUser.toObject();
        delete userResponse.password;
        delete userResponse.refreshToken;

        return userResponse;
    } catch (err) {
        if (err instanceof ApiError) throw err;
        throw new ApiError(500, "Failed to register user");
    }
};

const loginUser = async (credentials) => {
    try {
        const { email, username, password } = credentials;

        if (!username && !email) {
            throw new ApiError(400, "Username or email is required");
        }

        const user = await userRepository.findByUsernameOrEmail(username, email);

        if (!user) {
            throw new ApiError(404, "User does not exist");
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid user credentials");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        const loggedInUser = await userRepository.findById(user._id);
        const userResponse = loggedInUser.toObject();
        delete userResponse.password;
        delete userResponse.refreshToken;

        return {
            user: userResponse,
            accessToken,
            refreshToken
        };
    } catch (err) {
        if (err instanceof ApiError) throw err;
        throw new ApiError(500, "Failed to login user");
    }
};

export default {
    registerUser,
    loginUser
};
