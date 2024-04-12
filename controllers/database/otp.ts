// models
import model from "@/models";

import { typeOtpInstance } from "@/types/models";

const otp = {
	create: async (data: typeOtpInstance) => {
		try {
			await model.otp.sync();

			await model.otp.create({
				email: data.email,
				otp: data.otp,
				createdAt: data.createdAt,
				expiredAt: data.expiredAt,
			});
			console.log("+-> Otp created");
		} catch (error: any) {
			console.error("x-> Couldn't create otp:", error.message);
		}
	},
};

export default otp;
