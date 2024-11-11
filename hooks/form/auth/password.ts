import { passwordForgot, passwordReset } from "@/handlers/requests/auth/password";
import { millToMinSec, MinSec } from "@/utilities/formatters/number";
import email from "@/utilities/validators/special/email";
import { useForm, UseFormReturnType } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authUrls, timeout } from "@/data/constants";
import password from "@/utilities/validators/special/password";
import compare from "@/utilities/validators/special/compare";
import { PasswordReset as FormAuthPasswordReset } from "@/types/form";
import { NotificationVariant } from "@/types/enums";
import { showNotification } from "@/utilities/notifications";
import { useSignOut } from "@/hooks/auth";

export const useFormAuthPasswordForgot = () => {
	const [sending, setSending] = useState(false);
	const [requested, setRequested] = useState(false);
	const [time, setTime] = useState<MinSec | null>(null);

	const form = useForm({
		initialValues: { email: "" },
		validate: { email: (value) => email(value) },
	});

	const router = useRouter();

	const handleSubmit = async () => {
		try {
			if (form.isValid()) {
				setSending(true);
				setRequested(true);

				const response = await passwordForgot({ email: form.values.email.trim().toLowerCase() });

				if (!response) throw new Error("No response from server");

				const result = await response.json();

				form.reset();

				if (response.ok) {
					setTime(null);

					// redirect to notification page
					router.push(authUrls.verifyRequest);
					return;
				}

				if (response.status === 409) {
					// update time
					setTime(millToMinSec(result.expiry)!);
					return;
				}

				setTime(null);

				if (response.status === 403 || response.status === 404) {
					// redirect to notification page
					router.push(authUrls.verifyRequest);
					return;
				}

				showNotification({ variant: NotificationVariant.WARNING }, response, result);
				return;
			}
		} catch (error) {
			showNotification({ variant: NotificationVariant.FAILED, desc: (error as Error).message });
			return;
		} finally {
			setSending(false);
			setRequested(false);
		}
	};

	return { form, handleSubmit, sending, requested, time };
};

export const useFormAuthPasswordReset = (params: { userId: string; token: string }) => {
	const signOut = useSignOut();

	const [sending, setSending] = useState(false);

	const form: UseFormReturnType<FormAuthPasswordReset> = useForm({
		initialValues: { password: { initial: "", confirm: "" } },

		validate: {
			password: {
				initial: (value) => password(value, 8, 24),
				confirm: (value, values) => compare.string(value, values.password.initial, "Password"),
			},
		},
	});

	const parseValues = () => {
		return { password: form.values.password };
	};

	const handleSubmit = async () => {
		try {
			if (form.isValid()) {
				setSending(true);

				const response = await passwordReset({ password: parseValues().password.initial }, params);

				if (!response) throw new Error("No response from server");

				const result = await response.json();

				form.reset();

				if (response.ok) {
					// sign out
					setTimeout(async () => await signOut(), timeout.redirect);

					showNotification({ variant: NotificationVariant.SUCCESS }, response, result);
					return;
				}

				if (response.status === 409) {
					showNotification({ variant: NotificationVariant.WARNING }, response, result);
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

	return { form, handleSubmit, sending };
};
