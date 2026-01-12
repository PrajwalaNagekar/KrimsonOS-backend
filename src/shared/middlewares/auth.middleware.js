import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @description Middleware to restrict access based on user roles
 * @param {Array<string>} allowedRoles - List of roles that can access the route
 */
const authorize = (allowedRoles = []) => {
    return asyncHandler(async (req, res, next) => {
        // req.user is usually populated by a previous verifyJWT middleware
        if (!req.user) {
            throw new ApiError(401, "Unauthorized request");
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new ApiError(
                403,
                `Access denied. Role '${req.user.role}' is not authorized to access this resource.`
            );
        }

        next();
    });
};

export { authorize };
