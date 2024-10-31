import { sendInquiry } from "@/handlers/request/contact";
import { NotificationVariant } from "@/types/enums";
import { Contact } from "@/types/form";
import { capitalizeWord, capitalizeWords } from "@/utilities/formatters/string";
import { showNotification } from "@/utilities/notifications";
import email from "@/utilities/validators/special/email";
import phone from "@/utilities/validators/special/phone";
import text from "@/utilities/validators/special/text";
import { useForm, UseFormReturnType } from "@mantine/form";
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
			message: "",
		},

		validate: {
			fname: (value) => text(value, 2, 24),
			lname: (value) => text(value, 2, 24),
			email: (value) => email(value),
			phone: (value) => value.trim().length > 0 && phone(value),
			subject: (value) => text(value, 3, 255, true),
			message: (value) => text(value, 3, 2048, true),
		},
	});

	const parseValues = () => {
		return {
			fname: capitalizeWord(form.values.fname.trim()),
			lname: capitalizeWord(form.values.lname.trim()),
			email: form.values.email.trim().toLowerCase(),
			phone: form.values.phone?.trim() ? (form.values.phone.trim().length > 0 ? form.values.phone : "") : "",
			subject: capitalizeWords(form.values.subject.trim()),
			message: form.values.message.trim(),
		};
	};

	const handleSubmit = async () => {
		if (form.isValid()) {
			try {
				setSubmitted(true);

				const response = await sendInquiry(parseValues());

				if (!response) {
					throw new Error("No response from server");
				}

				const result = await response.json();

				form.reset();

				if (response.ok) {
					showNotification({ variant: NotificationVariant.SUCCESS }, response, result);
					return;
				}

				showNotification({ variant: NotificationVariant.FAILED }, response, result);
			} catch (error) {
				showNotification({ variant: NotificationVariant.FAILED, desc: (error as Error).message });
				return;
			} finally {
				setSubmitted(false);
			}
		}
	};

	return {
		form,
		submitted,
		handleSubmit,
	};
};
