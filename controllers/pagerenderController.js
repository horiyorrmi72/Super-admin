import pug from 'pug';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Render the Admin Page
export const adminPage = async (req, res) => {
	return res.send(
		pug.renderFile(`${__dirname}/../views/templates/admin.pug`, {
			title: 'Admin Dashboard',
		})
	);
};

// Render the Login Page
export const loginPage = async (req, res) => {
	return res.send(
		pug.renderFile(`${__dirname}/../views/templates/login.pug`, {
			title: 'Login Page',
		})
	);
};
