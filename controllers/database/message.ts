import prisma from "@/databases/next";
import { typeContact } from "@/types/form";

const message = {
	create: async (messageData: typeContact) => {
		try {
			await prisma.message.create({ data: messageData });

			console.log("+-> Message created");
		} catch (error: any) {
			console.error("x-> Couldn't create message:", error.message);
		}
	},
};

export default message;
