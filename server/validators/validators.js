import { body, validationResult } from 'express-validator';

// Register Validation Middleware
export const validateSignup = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long.')
        .matches(/\d/)
        .withMessage('Password must contain a number.')
        .matches(/[A-Z]/)
        .withMessage('Password must contain an uppercase letter.')
        .matches(/[a-z]/)
        .withMessage('Password must contain a lowercase letter.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        next();
    }
];

export const validateSignin = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.'),
    body('password')
        .notEmpty()
        .withMessage('Password is required.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        next();
    }
];


export const validateForgotPassword = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        next();
    }
];

export const validateResetPassword = [
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long.')
        .matches(/\d/)
        .withMessage('Password must contain a number.')
        .matches(/[A-Z]/)
        .withMessage('Password must contain an uppercase letter.')
        .matches(/[a-z]/)
        .withMessage('Password must contain a lowercase letter.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        next();
    }
];



