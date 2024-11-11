import { emailCreate } from "@/handlers/requests/email/email";
import { EmailInquiry } from "@/types/email";
import { NotificationVariant } from "@/types/enums";
import { capitalizeWords, segmentFullName } from "@/utilities/formatters/string";
import { showNotification } from "@/utilities/notifications";
import email from "@/utilities/validators/special/email";
import phone from "@/utilities/validators/special/phone";
import text from "@/utilities/validators/special/text";
import { useForm, UseFormReturnType } from "@mantine/form";
import { useState } from "react";

export const useFormEmailInquiry = () => {
	const [submitted, setSubmitted] = useState(false);

	const form: UseFormReturnType<Omit<EmailInquiry, "to"> & { phone: string; message: string }> = useForm({
		initialValues: {
			from: { name: "", email: "" },
			subject: "",
			phone: "",
			message: "",
		},

		validate: {
			from: { name: (value) => text(value, 2, 24), email: (value) => email(value) },
			subject: (value) => text(value, 3, 255, true),
			phone: (value) => value.trim().length > 0 && phone(value),
			message: (value) => text(value, 3, 2048, true),
		},
	});

	const parseValues = () => {
		const fullName = segmentFullName(capitalizeWords(form.values.from.name.trim()));

		return {
			from: {
				name: `${fullName.first} ${fullName.last}`,
				email: form.values.from.email.trim().toLowerCase(),
			},
			subject: capitalizeWords(form.values.subject.trim()),
			phone: form.values.phone?.trim() ? (form.values.phone.trim().length > 0 ? form.values.phone : "") : "",
			message: form.values.message.trim(),
		};
	};

	const handleSubmit = async () => {
		if (form.isValid()) {
			try {
				setSubmitted(true);

				const response = await emailCreate(parseValues());

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
