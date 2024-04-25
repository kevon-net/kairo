import bcryptjs from "bcryptjs";

const hasher = {
	create: async (password: string) => {
		try {
			return await bcryptjs.hash(password, 10);
		} catch (error) {
			console.error("x-> Hash creation failure:", (error as Error).message);
		}
	},

	compare: async (password: string, passwordHashed: string) => {
		try {
			return await bcryptjs.compare(password, passwordHashed);
		} catch (error) {
			console.error("x-> Hash comparison failure:", (error as Error).message);
		}
	},
};

export default hasher;
