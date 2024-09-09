import bcrypt from 'bcryptjs';
const saltRound = 12;

/**
 *
 * @param {data} - this is the data we need to hash
 * @returns {String} return the hash string of the data that was passed in
 */
export const hashData = async (data) => {
	const hashedData = bcrypt.hash(data, saltRound);
	return hashedData;
};

/**
 *
 * @param {String} plainData the plain data that needs to be compared against the hashed data
 * @param {String} hashedData  the hashed data that the plain data is compared against
 * @returns {boolean} true if the hashed data matches the hashed data and false otherwise.
 */
export const compareData = async (plainData, hashedData) => {
	const comparedData = await bcrypt.compare(plainData, hashedData);
	return comparedData;
};
