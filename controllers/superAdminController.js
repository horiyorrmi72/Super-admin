#!/usr/bin/env node
import { stdin } from 'node:process';
import { connectToDatabase } from '../config/database.config.js';
import Admin from '../models/admin.model.js';
import { hashData } from '../utils/hasher.utils.js';
import readline from 'node:readline';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const askQuestion = (query) =>
	new Promise((resolve) => rl.question(query, resolve));

const validateEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export async function createSuperAdmin() {
	try {
		console.log('Create a super admin\n');

		const ready = await askQuestion('Are you ready? (Y/N): ');

		if (ready.toUpperCase() === 'Y' || ready.toUpperCase() === 'YES') {
			console.log(`Great! Let's get you signed up.\n`);
			const db_uri = await askQuestion('Database connection string: ');
			if (!db_uri) {
				console.log('You need to provide your database connection string.');
				return;
			}

			await connectToDatabase(db_uri);

			const firstName = await askQuestion('Your first name: ');
			if (!firstName) {
				console.log('You need to provide your first name.');
				return;
			}

			const lastName = await askQuestion('Your last name: ');
			if (!lastName) {
				console.log('You need to provide your last name.');
				return;
			}

			const email = await askQuestion('Your email address: ');
			if (!email || !validateEmail(email)) {
				console.log('You need to provide a valid email address.');
				return;
			}
			const existingSuperAdmin = await Admin.findOne({ email });
			if (existingSuperAdmin) {
				console.log('A user with this email already exists.');
				return;
			}

			let phoneNumber = await askQuestion('Your phone number (optional): ');
			if (!phoneNumber) {
				phoneNumber = 'No phone number provided';
			}

			const password = await askQuestion('Your password: ');
			const confirmPassword = await askQuestion('Confirm your password: ');
			if (!password || password !== confirmPassword) {
				console.log('Passwords do not match or password is missing.');
				return;
			}

			const hashedPassword = await hashData(password);

			const superAdmin = new Admin({
				firstName,
				lastName,
				email,
				phoneNumber,
				password: hashedPassword,
				role: 'super-admin',
				permissions: 'read-write-delete',
			});

			await superAdmin.save();
			console.log(`Super-Admin ${firstName} ${lastName} created successfully!`);
		} else {
			console.log('Aborted by the user.');
		}
	} catch (error) {
		console.error('An error occurred while creating the super-admin:', error);
	} finally {
		rl.close();
	}
}

createSuperAdmin();
