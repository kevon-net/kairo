// models
import model from "@/models";

import { typeMessageInstance } from "@/types/models";

const message = {
	create: async (data: typeMessageInstance) => {
		try {
			await model.message.sync();

			await model.message.create({
				fname: data.fname,
				lname: data.lname,
				email: data.email,
				phone: data.phone,
				subject: data.subject,
				message: data.message,
			});
			console.log("+-> Message created");
		} catch (error: any) {
			console.error("x-> Couldn't create message:", error.message);
		}
	},
};

export default message;
