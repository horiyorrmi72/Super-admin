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

async function createSuperAdmin() {
	try {
		console.log('Create a super admin\n');

		const ready = await askQuestion('Are you ready? (Y/N): ');

		if (ready.toUpperCase() === 'Y' || ready.toUpperCase() === 'YES') {
			console.log(`Great! Let's get you signed up.\n`);
			const db_uri = await askQuestion('Database connection string: ');
			if (!db_uri) {
				console.log(
					'You need to provide your database connection string where the user data will be stored.'
				);
				return rl.close();
			}

			await connectToDatabase(db_uri);

			const firstName = await askQuestion('Your first name: ');
			if (!firstName) {
				console.log('You need to provide your first name.');
				return rl.close();
			}

			const lastName = await askQuestion('Your last name: ');
			if (!lastName) {
				console.log('You need to provide your last name.');
				return rl.close();
			}

			const email = await askQuestion('Your email address: ');
			if (!email || !validateEmail(email)) {
				console.log('You need to provide a valid email address.');
				return rl.close();
			}
			const existingSuperAdmin = await Admin.findOne({ email: email });
			if (existingSuperAdmin) {
				console.log('user with email already exists.');
				return rl.close();
			}
			let phoneNumber = await askQuestion(
				`Your phone number if you don't mind: `
			);
			if (!phoneNumber) {
				console.log(`No problem, let's continue.`);
				phoneNumber = 'no phone number provided';
			}

			const password = await askQuestion('Your password: ');
			if (!password) {
				console.log('You need to provide a password.');
				return rl.close();
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
			rl.close();
		} else {
			console.log('Aborted by the user.');
		}
		
		rl.close();
	} catch (error) {
		console.error('An error occurred while creating the super-admin:', error);
		rl.close();
	}
}

createSuperAdmin();
