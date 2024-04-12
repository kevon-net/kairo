"use server";

import bcrypt from "bcrypt";

const hasher = {
	create: async (value: string) => {
		const saltRounds = 10;

		try {
			return await bcrypt.hash(value, saltRounds);
		} catch (error: any) {
			console.error("x-> Hash creation failure:", error.message);
		}
	},

	compare: async (value: string, hashedValue: string) => {
		try {
			return await bcrypt.compare(value, hashedValue);
		} catch (error: any) {
			console.error("x-> Hash comparison failure:", error.message);
		}
	},
};

export default hasher;
