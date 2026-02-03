import { verifyToken } from '../utils/jwt.js';
import User from '../database/models/User.js';

/**
 * Lenient authentication middleware - optional authentication
 * Allows public access but attaches user if token is provided
 */
const authLenient = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        // If no token, continue without user
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            req.user = null;
            return next();
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        try {
            // Verify token
            const decoded = verifyToken(token);

            // Get user from database
            const user = await User.findById(decoded.userId);

            if (user && user.isActive) {
                req.user = user;
            } else {
                req.user = null;
            }
        } catch (error) {
            // Invalid token, but continue without user
            req.user = null;
        }

        next();
    } catch (error) {
        // On any error, continue without user
        req.user = null;
        next();
    }
};

export default authLenient;
