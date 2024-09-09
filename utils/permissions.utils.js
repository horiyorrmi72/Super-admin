export const checkPermissions = async (req) => {
	const user = req.user;
	const userRole = user.role;
	const userPermissions = user.role.permissions;
	return {
		role: userRole,
		permissions: userPermissions,
	};
};
