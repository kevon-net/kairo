import prisma from "@/databases/next";
import { typeOtp } from "@/types/ot";

const otp = {
	create: async (otpData: any) => {
		try {
			await prisma.otp.create(otpData);

			console.log("+-> Message created");
		} catch (error: any) {
			console.error("x-> Couldn't create message:", error.message);
		}
	},
};

export default otp;
