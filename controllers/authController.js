import AppError from '../utils/appError.utils.js';
import Admin from '../models/admin.model.js';
import { compareData, hashData } from '../utils/hasher.utils.js';
import { validationResult } from 'express-validator';
import { generateToken } from '../utils/tokenFactory.utils.js';

// Register Admin
export const registerAdmin = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new AppError(
				400,
				`Ensure that all data is provided correctly,\n error: ${JSON.stringify(
					errors.array()
				)}`
			)
		);
	}
	const {
		firstName,
		lastName,
		email,
		phoneNumber,
		password,
		confirmPassword,
		permissions,
		role = 'admin',
	} = req.body;
	const existingAdmin = await Admin.findOne({ email }).exec();
	if (existingAdmin) {
		return res.status(409).json({ message: 'Admin user already exists' });
	}
	if (password !== confirmPassword) {
		return next(new AppError(400, 'Passwords do not match'));
	}
	const hashPassword = await hashData(password);
	const admin = new Admin({
		firstName,
		lastName,
		email,
		password: hashPassword,
		phoneNumber,
		role,
		permissions,
	});
	await admin.save();
	return res.status(201).json({
		success: true,
		message: 'Admin user created successfully',
		data: {
			admin,
		},
	});
};

//admin sign in
export const administratorSignIn = async (req, res, next) => {
	const { email, password } = req.body;
	if (!(email || password)) {
		return next(new AppError(400, 'all fields required.'));
	}
	const validAdmin = await Admin.findOne({ email }).select('+password');
	if (!validAdmin) {
		return next(
			new AppError(
				404,
				'Are you sure you a registered user and have the priviledge to perform this action?'
			)
		);
	}
	const validPassword = await compareData(password, validAdmin.password);
	if (!validPassword) {
		return next(
			new AppError(400, 'data do not match, verify all provided data.')
		);
	}
	const token = await generateToken(validAdmin._id);

	return res.status(200).json({
		success: true,
		token,
		email,
	});
};
