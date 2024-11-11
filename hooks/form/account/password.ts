import { useForm, UseFormReturnType } from "@mantine/form";
import { useState } from "react";
import password from "@/utilities/validators/special/password";
import compare from "@/utilities/validators/special/compare";
import { PasswordReset } from "@/types/form";
import { userUpdate } from "@/handlers/requests/database/user";
import { timeout } from "@/data/constants";
import { NotificationVariant } from "@/types/enums";
import { showNotification } from "@/utilities/notifications";
import { useSession } from "@/hooks/session";

export const useFormUserAccountPassword = (params: { withCredentials: boolean }) => {
	const [sending, setSending] = useState(false);
	const { session, updateSession } = useSession();

	const form: UseFormReturnType<PasswordReset & { current: string; withPassword: boolean }> = useForm({
		initialValues: {
			password: { initial: "", confirm: "" },
			current: "",
			withPassword: params.withCredentials,
		},

		validate: {
			current: (value) => params.withCredentials && password(value, 8, 24),
			password: {
				initial: (value, values) =>
					value == values.current ? "Current and new passwords cannot be the same" : password(value, 8, 24),
				confirm: (value, values) => compare.string(value, values.password.initial, "Password"),
			},
		},
	});

	if (!session) return;

	const parseValues = () => {
		return {
			current: form.values.current,
			new: form.values.password.initial,
		};
	};

	const handleSubmit = async () => {
		try {
			if (form.isValid()) {
				setSending(true);

				const response = await userUpdate(
					{ password: parseValues().current },
					{ password: { update: { new: parseValues().new } } }
				);

				if (!response) throw new Error("No response from server");

				const result = await response.json();

				form.reset();

				if (response.ok) {
					if (!params.withCredentials) {
						// // update the session data on the client-side
						// await updateSession({ ...session, withPassword: true });

						// refresh the page
						window.location.reload();

						return;
					}

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

					showNotification({ variant: NotificationVariant.FAILED }, response, result);
					return;
				}

				showNotification({ variant: NotificationVariant.FAILED }, response, result);
				return;
			}
		} catch (error) {
			showNotification({ variant: NotificationVariant.FAILED, desc: (error as Error).message });
			return;
		} finally {
			setSending(false);
		}
	};

	return {
		form,
		sending,
		handleSubmit,
	};
};
