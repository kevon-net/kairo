import phone from "@/utilities/validators/special/phone";
import text from "@/utilities/validators/special/text";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { profileUpdate } from "@/handlers/requests/database/profile";
import { NotificationVariant } from "@/types/enums";
import { showNotification } from "@/utilities/notifications";
import { timeout } from "@/data/constants";
import { useSession } from "@/hooks/auth";

export const useFormUserProfile = () => {
	const { session, updateSession } = useSession();

	const [submitted, setSubmitted] = useState(false);

	const form = useForm({
		initialValues: {
			name: session?.user?.name || "",
			phone: "",
		},

		validate: {
			name: (value) => (value && value?.trim().length > 0 ? text(value, 2, 255) : "Please fill out this field."),
			phone: (value) => value.trim().length > 0 && phone(value),
		},
	});

	if (!session) return;

	const parseValues = () => {
		return {
			name: `${form.values.name}`,
			// phone: form.values.phone?.trim() ? (form.values.phone.trim().length > 0 ? form.values.phone : "") : "",
		};
	};

	const handleSubmit = async () => {
		if (form.isValid()) {
			try {
				if (!form.isDirty()) {
					showNotification({
						variant: NotificationVariant.WARNING,
						title: "Nothing Updated",
						desc: "Update at least one form field",
					});
					return;
				}

				setSubmitted(true);

				const response = await profileUpdate(parseValues());

				if (!response) throw new Error("No response from server");

				const result = await response.json();

				form.reset();

				if (response.ok) {
					// // Update the session data on the client-side
					// await updateSession({
					// 	...session,
					// 	user: { ...session?.user, name: `${parseValues().firstName} ${parseValues().lastName}` },
					// });

					// refresh the page
					window.location.reload();
					return;
				}

				if (response.status === 401) {
					// // redirect to sign in
					// setTimeout(async () => await authSignIn(), timeout.redirect);

					showNotification({ variant: NotificationVariant.WARNING }, response, result);
					return;
				}

				if (response.status === 404) {
					// // sign out and redirect to home page
					// setTimeout(async () => await handleSignOut({ redirectUrl: "/" }), timeout.redirect);

					showNotification({ variant: NotificationVariant.FAILED }, response, result);
					return;
				}

				showNotification({ variant: NotificationVariant.FAILED }, response, result);
				return;
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
		session,
	};
};
