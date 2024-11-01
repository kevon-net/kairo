import { useForm, UseFormReturnType } from "@mantine/form";
import { useState } from "react";
import { signOut as handleSignOut } from "@/handlers/event/sign-out";
import password from "@/utilities/validators/special/password";
import compare from "@/utilities/validators/special/compare";
import { AccountPassword, PasswordReset } from "@/types/form";
import { updateAccountPassword } from "@/handlers/request/user/account";
import { timeout } from "@/data/constants";
import { NotificationVariant } from "@/types/enums";
import { showNotification } from "@/utilities/notifications";
import { signIn as authSignIn } from "next-auth/react";

export const useFormUserAccountPassword = () => {
	const [sending, setSending] = useState(false);

	const form: UseFormReturnType<PasswordReset & { current: string }> = useForm({
		initialValues: {
			password: { initial: "", confirm: "" },
			current: "",
		},

		validate: {
			password: {
				initial: (value, values) =>
					value == values.current ? "Current and new passwords cannot be the same" : password(value, 8, 24),
				confirm: (value, values) => compare.string(value, values.password.initial, "Password"),
			},
			current: (value) => password(value, 8, 24),
		},
	});

	const parseValues = (): AccountPassword => {
		return {
			password: { current: form.values.current, new: form.values.password.initial },
		};
	};

	const handleSubmit = async () => {
		try {
			if (form.isValid()) {
				setSending(true);

				const response = await updateAccountPassword(parseValues());

				if (!response) throw new Error("No response from server");

				const result = await response.json();

				form.reset();

				if (response.ok) {
					showNotification({ variant: NotificationVariant.SUCCESS }, response, result);
					return;
				}

				if (response.status === 401) {
					// redirect to sign in
					setTimeout(async () => await authSignIn(), timeout.redirect);

					showNotification({ variant: NotificationVariant.WARNING }, response, result);
					return;
				}

				if (response.status === 404) {
					// sign out and redirect to home page
					setTimeout(async () => await handleSignOut({ redirectUrl: "/" }), timeout.redirect);

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
