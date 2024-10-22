import email from "@/utilities/validators/special/email";
import phone from "@/utilities/validators/special/phone";
import text from "@/utilities/validators/special/text";
import { useForm, UseFormReturnType } from "@mantine/form";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Profile as FormProfile } from "@/types/form";
import { capitalizeWords } from "@/utilities/formatters/string";
import IconNotificationError from "@/components/common/icons/notification/error";
import IconNotificationSuccess from "@/components/common/icons/notification/success";
import { notifications } from "@mantine/notifications";
import { updateProfile } from "@/handlers/request/user/profile";

export const useFormUserProfile = () => {
	const { data: session, update } = useSession();

	const [submitted, setSubmitted] = useState(false);

	const form: UseFormReturnType<FormProfile> = useForm({
		initialValues: {
			name: session?.user?.name ? session?.user?.name : "",
			email: session?.user?.email ? session?.user?.email : "",
			phone: ""
		},

		validate: {
			name: (value) => (value && value?.trim().length > 0 ? text(value, 2, 255) : "Please fill out this field."),
			email: (value) => value && email(value),
			phone: (value) => value.trim().length > 0 && phone(value)
		}
	});

	const parseValues = () => {
		return {
			name: form.values.name && capitalizeWords(form.values.name),
			email: form.values.email && form.values.email.trim().toLowerCase(),
			phone: form.values.phone?.trim() ? (form.values.phone.trim().length > 0 ? form.values.phone : "") : ""
		};
	};

	const handleSubmit = async () => {
		if (form.isValid()) {
			try {
				if (!form.isDirty()) {
					notifications.show({
						id: "form-contact-failed-no-update",
						icon: IconNotificationError(),
						title: "Failed",
						message: "No form fields have been updated",
						variant: "failed"
					});
				} else {
					setSubmitted(true);

					const result = await updateProfile(parseValues());

					if (!result) {
						notifications.show({
							id: "profile-update-failed-no-response",
							icon: IconNotificationError(),
							title: "Server Unavailable",
							message: `There was no response from the server.`,
							variant: "failed"
						});

						form.reset();
					} else {
						if (!result.user.exists) {
							notifications.show({
								id: "profile-update-failed-no-user",
								icon: IconNotificationError(),
								title: "Unauthorized",
								message: `You're not allowed to perform this action.`,
								variant: "failed"
							});

							form.reset();
						} else {
							// Update the session data on the client-side
							await update({
								...session,
								user: {
									...session?.user,
									name: parseValues().name
								}
							});

							notifications.show({
								id: "profile-update-success",
								icon: IconNotificationSuccess(),
								title: "Profile Updated",
								message: "Your profile details are up to date.",
								variant: "success"
							});
						}
					}
				}
			} catch (error) {
				notifications.show({
					id: "profile-update-failed",
					icon: IconNotificationError(),
					title: "Submisstion Failed",
					message: (error as Error).message,
					variant: "failed"
				});

				form.reset();
			} finally {
				setSubmitted(false);
			}
		}
	};

	return {
		form,
		submitted,
		handleSubmit,
		session
	};
};
