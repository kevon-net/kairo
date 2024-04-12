// models
import model from "@/models";

import { typeOtlInstance } from "@/types/models";

const otl = {
	create: async (data: typeOtlInstance) => {
		try {
			await model.otl.sync();

			await model.otl.create({
				email: data.email,
				otl: data.otl,
				userId: data.userId,
				createdAt: data.createdAt,
				expiredAt: data.expiredAt,
			});
			console.log("+-> Otl created");
		} catch (error: any) {
			console.error("x-> Couldn't create otl:", error.message);
		}
	},
};

export default otl;
