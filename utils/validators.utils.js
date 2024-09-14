import { body } from 'express-validator';

export const signUpValidator = [
	body('firstName').notEmpty().withMessage('First name is required'),
	body('lastName').notEmpty().withMessage('Last name is required'),
	body('email')
		.notEmpty()
		.withMessage('Email is required')
		.isEmail()
		.withMessage('Invalid email address'),
	body('phoneNumber').notEmpty().withMessage('Phone number is required'),
	body('password').notEmpty().withMessage('Password is required'),
];

export const signInValidator = [
	body('email')
		.notEmpty()
		.withMessage('Email is required!')
		.isEmail()
		.withMessage('Provide a valid email address.'),
	body('password').notEmpty().withMessage('Password  can not be empty'),
];
