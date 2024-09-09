import AppError from './appError.utils.js';

export const handleError = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	res.status(err.statusCode).json({
		status: err.status,
		message: err.message || 'An unknown error occurred',
		stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
	});
};
