// models
import model from "@/models";

import { typeUserInstance } from "@/types/models";

const user = {
	create: async (data: typeUserInstance) => {
		try {
			await model.user.sync();

			await model.user.create({
				fname: data.fname,
				lname: data.lname,
				email: data.email,
				phone: data.phone,
				password: data.password,
				verified: data.verified,
			});
		} catch (error: any) {
			console.error("x-> Couldn't create user:", error.message);
		}
	},
};

export default user;
