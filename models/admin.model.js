import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const adminSchema = new Schema({
	firstName: { type: String, required: true, trim: true },
	lastName: { type: String, required: true, trim: true },
	email: { type: String, required: true, trim: true, unique: true },
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 4,
		select: false,
	},
	phoneNumber: { type: String, trim: true, unique:false},
	role: {
		type: String,
		required: true,
		trim: true,
		enum: ['admin', 'super-admin', 'super-user'],
		select: false,
	},
	permissions: {
		type: String,
		required: true,
		trim: true,
		enum: ['read-only', 'read-write', 'read-write-delete'],
		default: 'read-only',
		select: false,
	},
});
const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
