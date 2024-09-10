import { model, Model } from 'mongoose';
import  AppError  from './appError.utils.js';

export const findAll = async (Model, req, res, next) => {
	const documents = await Model.find().exec();
	if (documents.length === 0) {
		return next(new AppError(404, 'No documents found!'));
	}
	return res.status(200).json({
		success: true,
		message: 'Successfully fetched data',
		data: {
			documents,
		},
	});
};

export const findOne = async (Model, req, res, next) => {
	const { id } = req.params;
	const doc = await Model.findById(id);
	if (!doc) {
		return next(new AppError(404, 'No document found.'));
	}
	return res.status(200).json({
		success: true,
		message: 'Document found!',
		data: {
			doc,
		},
	});
};

export const updateOne = async (Model, req, res, next) => {
	const { id } = req.params;
	const doc = await Model.findById(id);
	if (!doc) {
		return next(new AppError(404, 'No document found.'));
	}
	const dataToUpdate = req.body;
	const updatedDoc = await Model.findByIdAndUpdate(id, dataToUpdate, {
		new: true,
		runValidators: true,
	});
	return res.status(200).json({
		success: true,
		message: 'Data updated successfully',
		data: {
			updatedDoc,
		},
	});
};

export const deleteOne = async (Model, req, res, next) => {
	const { id } = req.params;
	const doc = await Model.findById(id);
	if (!doc) {
		return next(new AppError(404, 'Document does not exist!'));
	}
	await Model.findByIdAndDelete(id);
	return res.status(204).json({
		success: true,
		message: 'Document was successfully deleted',
	});
};

export const deleteMore = async (Model, req, res, next) => {
	const { id } = req.query;
	if (!id || !Array.isArray(id)) {
		return next(new AppError(400, 'Invalid data: ID must be an array.'));
	}

	// Validate that each ID is a valid MongoDB ObjectId
	if (!id.every((id) => /^[0-9a-fA-F]{24}$/.test(id))) {
		return next(new AppError(400, 'Invalid ID format.'));
	}

	try {
		const result = await Model.deleteMany({ _id: { $in: id } });
		return res
			.status(204)
			.json({ success: true, message: 'Documents deleted successfully!' });
	} catch (error) {
		return next(new AppError(500, 'Server error.'));
	}
};
