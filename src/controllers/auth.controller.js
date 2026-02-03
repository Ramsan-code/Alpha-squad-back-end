import User from '../database/models/User.js';
import Student from '../database/models/Student.js';
import Teacher from '../database/models/Teacher.js';
import Review from '../database/models/Review.js';
import { generateToken } from '../utils/jwt.js';

/**
 * Register a new student
 * POST /auth/register/student
 */
export const registerStudent = async (req, res) => {
    try {
        const { email, password, ...profileData } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Create user account
        const user = await User.create({
            email,
            password,
            role: 'student'
        });

        // Create student profile (pending approval)
        const student = await Student.create({
            userId: user._id,
            ...profileData,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Student registration successful. Awaiting admin approval.',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role
                },
                profile: student
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Registration failed'
        });
    }
};

/**
 * Register a new teacher
 * POST /auth/register/teacher
 */
export const registerTeacher = async (req, res) => {
    try {
        const { email, password, ...profileData } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Create user account
        const user = await User.create({
            email,
            password,
            role: 'teacher'
        });

        // Create teacher profile (pending approval)
        const teacher = await Teacher.create({
            userId: user._id,
            ...profileData,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Teacher registration successful. Awaiting admin approval.',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role
                },
                profile: teacher
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Registration failed'
        });
    }
};

/**
 * Register a new review user (auto-approved)
 * POST /auth/register/review
 */
export const registerReview = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Create user account (auto-approved for review role)
        const user = await User.create({
            email,
            password,
            role: 'review'
        });

        // Generate token for immediate login
        const token = generateToken({ userId: user._id, role: user.role });

        res.status(201).json({
            success: true,
            message: 'Review user registration successful.',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Registration failed'
        });
    }
};

/**
 * Login user
 * POST /auth/login
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user with password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated'
            });
        }

        // Check approval status for roles that require it
        if (user.role === 'student') {
            const student = await Student.findOne({ userId: user._id });
            if (!student || student.status !== 'approved') {
                return res.status(403).json({
                    success: false,
                    message: 'Your account is pending admin approval'
                });
            }
        } else if (user.role === 'teacher') {
            const teacher = await Teacher.findOne({ userId: user._id });
            if (!teacher || teacher.status !== 'approved') {
                return res.status(403).json({
                    success: false,
                    message: 'Your account is pending admin approval'
                });
            }
        }

        // Generate token
        const token = generateToken({ userId: user._id, role: user.role });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Login failed'
        });
    }
};

/**
 * Get current user profile
 * GET /auth/me
 */
export const getMe = async (req, res) => {
    try {
        const user = req.user;

        let profile = null;

        // Fetch role-specific profile
        if (user.role === 'student') {
            profile = await Student.findOne({ userId: user._id });
        } else if (user.role === 'teacher') {
            profile = await Teacher.findOne({ userId: user._id });
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive
                },
                profile
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch profile'
        });
    }
};
