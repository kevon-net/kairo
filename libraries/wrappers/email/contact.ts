import resend from "@/libraries/resend";

export const emailContactCreate = async (params: { fname?: string; lname?: string; email: string }) => {
	const { data, error } = await resend.general.contacts.create({
		email: params.email,
		firstName: params.fname,
		lastName: params.lname,
		unsubscribed: false,
		audienceId: process.env.NEXT_RESEND_AUDIENCE_ID_GENERAL!
	});

	if (!error) {
		return data;
	} else {
		console.error("---> wrapper error - (email contact create):", error);
		throw error;
	}
};
