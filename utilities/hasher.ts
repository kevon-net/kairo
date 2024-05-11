import bcryptjs from "bcryptjs";

const hasher = {
	async create(password: string): Promise<string | undefined> {
		try {
			return await bcryptjs.hash(password, 10);
		} catch (error) {
			console.error("x-> Hash creation failure:", (error as Error).message);
		}
	},

	async compare(password: string, passwordHashed: string | null): Promise<boolean | null | undefined> {
		try {
			return passwordHashed ? await bcryptjs.compare(password, passwordHashed) : null;
		} catch (error) {
			console.error("x-> Hash comparison failure:", (error as Error).message);
		}
	},
};

export default hasher;
