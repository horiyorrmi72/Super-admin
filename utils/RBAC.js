import AppError from './appError.utils.js';
import { checkPermissions } from './permissions.utils.js';

export const isSuperAdmin = async (req, res, next) => {
	try {
		const { role, permissions } = await checkPermissions(req);
		if (role !== 'super-admin' || !permissions.includes('read-write-delete')) {
			return next(
				new AppError(
					401,
					'You are not authorized to access and perform this action'
				)
			);
		}
		next();
	} catch (error) {
		next(error);
	}
};
export const isSuperUser = async (req, res, next) => {
	try {
		const { role, permissions } = await checkPermissions(req);
		if (!role || role !== 'super-user') {
			return next(
				new AppError(
					401,
					'you do not have the permission to perform this action.'
				)
			);
		}
		next();
	} catch (error) {
		next(error);
	}
};

export const isAdmin = async (req, res, next) => {
	try {
		const { role } = await checkPermissions(req);
		if (role !== 'admin') {
			return next(
				new AppError('401', 'you are not authorized to perform this action')
			);
		}
		next();
	} catch (error) {
		next(error);
	}
};
export const extraPermissionsChecker = async (
	req,
	res,
	next,
	requiredPermission
) => {
	try {
		const { permissions } = await checkPermissions(req);
		if (!permissions || !permissions.includes(requiredPermission)) {
			return next(
				new AppError(
					401,
					' you do not have the permission to perform this action.'
				)
			);
		}
		next();
	} catch (error) {
		next(error);
	}
};
