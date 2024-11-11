import phone from "@/utilities/validators/special/phone";
import text from "@/utilities/validators/special/text";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { profileUpdate } from "@/handlers/requests/database/profile";
import { NotificationVariant } from "@/types/enums";
import { showNotification } from "@/utilities/notifications";
import { timeout } from "@/data/constants";
import { useSession, useSignOut } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import { setRedirectUrl } from "@/utilities/helpers/url";
import { segmentFullName } from "@/utilities/formatters/string";

export const useFormUserProfile = () => {
	const router = useRouter();

	const { session, updateSession, pathname } = useSession();
	const signOut = useSignOut();

	const [submitted, setSubmitted] = useState(false);

	const name = session?.user.name;

	const form = useForm({
		initialValues: {
			name: {
				first: !name ? "" : segmentFullName(name).first,
				last: !name ? "" : segmentFullName(name).last,
			},
			phone: "",
		},

		validate: {
			name: {
				first: (value) => (value?.trim().length > 0 ? text(value, 2, 48) : "Please fill out this field."),
				last: (value) => (value?.trim().length > 0 ? text(value, 2, 48) : "Please fill out this field."),
			},
			phone: (value) => value.trim().length > 0 && phone(value),
		},
	});

	if (!session) return;

	const parseValues = () => {
		return {
			name: `${form.values.name.first.trim()} ${form.values.name.last.trim()}`,
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
					// redirect to sign in
					setTimeout(async () => router.push(setRedirectUrl(pathname)), timeout.redirect);

					showNotification({ variant: NotificationVariant.WARNING }, response, result);
					return;
				}

				if (response.status === 404) {
					// sign out
					setTimeout(async () => await signOut(), timeout.redirect);

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
