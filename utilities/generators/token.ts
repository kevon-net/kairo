import jwt from "jsonwebtoken";

export const generateToken = async (user: { id: string; email: string; password: string }, expiryInMins: number) => {
	// create secret
	const secret = process.env.NEXT_JWT_KEY + user.password;

	// create token
	const token = jwt.sign({ email: user.email, id: user.id }, secret, {
		expiresIn: expiryInMins * 60
	});

	return token;
};
