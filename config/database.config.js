import { config as configDotenv } from 'dotenv';
import mongoose from 'mongoose';

configDotenv();

// Connect to the database
export const connectToDatabase = async (db_uri) => {
	const dbUri = db_uri /*|| process.env.DB_URI || 'mongodb://127.0.0.1:27017';*/

	try {
		await mongoose.connect(dbUri, { dbName: 'express_admin_panel' });
		console.log('Connected to database');
	} catch (err) {
		console.error('Error connecting to database:', err.message);
	}
};
