import Admin from '../models/admin.model.js';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import AppError from '../utils/appError.utils.js';
import {
	deleteMore,
	findAll,
	findOne,
	updateOne,
} from '../utils/factoryHandler.js';
import { hashData } from '../utils/hasher.utils.js';

export const getAdmin = async (req, res, next) => {
	await findOne(User, req, res, next);
};

export const updateAdmin = async (req, res, next) => {
	await updateOne(User, req, res, next);
};

export const getAdmins = async (req, res, next) => {
	await findAll(User, req, res, next);
};

export const deleteAdmins = async (req, res, next) => {
	await deleteMore(User, req, res, next);
};

export const createSuperUser = async (req, res, next) => {
	const { firstName, lastName, email, password, role , permissions} = req.body;
	try {
		if (!(firstName || lastName || email || password||role||permissions)) {
			return next(new AppError(400, 'you must provide the details'));
		}
		const existingUserWithRole = await User.findOne({ email: email });
		if (existingUserWithRole && (
			existingUserWithRole.role === role ||
			existingUserWithRole.role === 'super-user')
		) {
			return next(new AppError(400, 'Existing user with role.'));
		}
		const hashTempPassword = await hashData(password);
		const newSuperUser = new User({
			firstName,
			lastName,
			email,
			password: hashTempPassword,
			role: 'super-user',
			permissions
		});
		return res.status(201).json({
			success: true,
			message: 'new super user created successfully',
			data: {
				newSuperUser,
			},
		});
	} catch (err) {
		console.error(err.message);
		return res
			.status(500)
			.json({
				message: 'Encountered an issue while creating new super user',
				Error: err.message,
			});
	}
};

// const __dirname = dirname(fileURLToPath(import.meta.url));
// export const adminUtilitiesPage = async (req, res, next) => {
// 	const templatePath = pug.renderFile(`${__dirname}/../views/templates/admin.pug`);



	
// }
