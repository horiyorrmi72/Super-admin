import jwt from 'jsonwebtoken';

export const generateToken = async (adminId) => {
	const generatedToken = jwt.sign({ adminId: adminId }, process.env.SECRET, {
		expiresIn: '1h',
	});
	return generatedToken;
};
