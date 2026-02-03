import { body, param, validationResult } from 'express-validator';

/**
 * Validation middleware wrapper
 */
export const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    };
};

/**
 * Common validation rules
 */
export const validationRules = {
    email: body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    password: body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    role: body('role')
        .isIn(['student', 'teacher', 'admin', 'transaction', 'review'])
        .withMessage('Invalid role'),

    mongoId: (field) => param(field)
        .isMongoId()
        .withMessage(`Invalid ${field}`),

    status: body('status')
        .isIn(['pending', 'approved', 'rejected', 'suspended'])
        .withMessage('Invalid status'),

    reason: body('reason')
        .optional()
        .isString()
        .withMessage('Reason must be a string')
};
