import IconNotificationError from "@/components/common/icons/notification/error";
import IconNotificationSuccess from "@/components/common/icons/notification/success";
import { sendInquiry } from "@/handlers/request/contact";
import { Contact } from "@/types/form";
import { capitalizeWord, capitalizeWords } from "@/utilities/formatters/string";
import email from "@/utilities/validators/special/email";
import phone from "@/utilities/validators/special/phone";
import text from "@/utilities/validators/special/text";
import { useForm, UseFormReturnType } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

export const useFormContact = () => {
	const [submitted, setSubmitted] = useState(false);

	const form: UseFormReturnType<Contact> = useForm({
		initialValues: {
			fname: "",
			lname: "",
			email: "",
			phone: "",
			subject: "",
			message: ""
		},

		validate: {
			fname: (value) => text(value, 2, 24),
			lname: (value) => text(value, 2, 24),
			email: (value) => email(value),
			phone: (value) => value.trim().length > 0 && phone(value),
			subject: (value) => text(value, 3, 255, true),
			message: (value) => text(value, 3, 2048, true)
		}
	});

	const parseValues = () => {
		return {
			fname: capitalizeWord(form.values.fname.trim()),
			lname: capitalizeWord(form.values.lname.trim()),
			email: form.values.email.trim().toLowerCase(),
			phone: form.values.phone?.trim() ? (form.values.phone.trim().length > 0 ? form.values.phone : "") : "",
			subject: capitalizeWords(form.values.subject.trim()),
			message: form.values.message.trim()
		};
	};

	const handleSubmit = async () => {
		if (form.isValid()) {
			try {
				setSubmitted(true);

				const result = await sendInquiry(parseValues());

				if (!result) {
					notifications.show({
						id: "form-contact-failed-no-response",
						icon: IconNotificationError(),
						title: "Server Unavailable",
						message: `There was no response from the server.`,
						variant: "failed"
					});
				} else {
					notifications.show({
						id: "form-contact-success",
						icon: IconNotificationSuccess(),
						title: "Form Submitted",
						message: "Someone will get back to you within 24 hours",
						variant: "success"
					});
				}
			} catch (error) {
				notifications.show({
					id: "form-contact-failed",
					icon: IconNotificationError(),
					title: "Submisstion Failed",
					message: (error as Error).message,
					variant: "failed"
				});
			} finally {
				form.reset();
				setSubmitted(false);
			}
		}
	};

	return {
		form,
		submitted,
		handleSubmit
	};
};
