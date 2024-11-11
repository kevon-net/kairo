import { useForm, UseFormReturnType } from "@mantine/form";
import { useState } from "react";
import { accountDelete } from "@/handlers/requests/database/account";
import { AccountDelete } from "@/types/form";
import { NotificationVariant } from "@/types/enums";
import { showNotification } from "@/utilities/notifications";
import { timeout } from "@/data/constants";

export const useFormUserAccountDelete = () => {
	const [submitted, setSubmitted] = useState(false);

	const form: UseFormReturnType<AccountDelete> = useForm({ initialValues: { password: "" } });

	const handleSubmit = async () => {
		if (form.isValid()) {
			try {
				setSubmitted(true);

				const response = await accountDelete({ password: form.values.password });

				if (!response) throw new Error("No response from server");

				const result = await response.json();

				form.reset();

				if (response.ok) {
					// // sign out and redirect to home page
					// setTimeout(async () => await handleSignOut({ redirectUrl: "/" }), timeout.redirect);

					showNotification({ variant: NotificationVariant.SUCCESS }, response, result);
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

					showNotification({ variant: NotificationVariant.WARNING }, response, result);
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
	};
};
