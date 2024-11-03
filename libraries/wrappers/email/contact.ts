import resend from "@/libraries/resend";
import { EmailInquiry } from "@/types/email";
import { segmentFullName } from "@/utilities/formatters/string";

export const contactCreateGeneral = async (contact: EmailInquiry["from"]) => {
	const { data, error } = await resend.general.contacts.create({
		email: contact.email,
		firstName: segmentFullName(contact.name).first,
		lastName: segmentFullName(contact.name).last,
		unsubscribed: false,
		audienceId: process.env.NEXT_RESEND_AUDIENCE_ID_GENERAL!,
	});

	if (!error) {
		return data;
	} else {
		console.error("---> wrapper error - (create email contact):", error);
		throw error;
	}
};
