import { passwordForgot } from "@/handlers/requests/auth/password";
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
import { userUpdate } from "@/handlers/requests/database/user";
import { getUrlParam, setRedirectUrl } from "@/utilities/helpers/url";
import { decrypt } from "@/utilities/helpers/token";
import { useNetwork } from "@mantine/hooks";

export const useFormAuthPasswordForgot = () => {
	const [sending, setSending] = useState(false);
	const [requested, setRequested] = useState(false);
	const [time, setTime] = useState<MinSec | null>(null);
	const networkStatus = useNetwork();

	const form = useForm({
		initialValues: { email: "" },
		validate: { email: (value) => email(value) },
	});

	const router = useRouter();

	const handleSubmit = async () => {
		if (form.isValid()) {
			try {
				if (!networkStatus.online) {
					showNotification({
						variant: NotificationVariant.WARNING,
						title: "Network Error",
						desc: "Please check your internet connection.",
					});
					return;
				}

				setSending(true);
				setRequested(true);

				const response = await passwordForgot(form.values.email.trim().toLowerCase());

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

				if (response.status === 404) {
					// redirect to notification page
					setTimeout(() => router.replace("/"), timeout.redirect);

					showNotification({ variant: NotificationVariant.WARNING }, response, result);
					return;
				}

				showNotification({ variant: NotificationVariant.FAILED }, response, result);
				return;
			} catch (error) {
				showNotification({ variant: NotificationVariant.FAILED, desc: (error as Error).message });
				return;
			} finally {
				setSending(false);
				setRequested(false);
			}
		}
	};

	return { form, handleSubmit, sending, requested, time };
};

export const useFormAuthPasswordReset = () => {
	const router = useRouter();
	const [sending, setSending] = useState(false);

	const form: UseFormReturnType<FormAuthPasswordReset> = useForm({
		initialValues: { password: { initial: "", confirm: "" } },

		validate: {
			password: {
				initial: (value) => password(value.trim(), 8, 24),
				confirm: (value, values) => compare.string(value, values.password.initial, "Password"),
			},
		},
	});

	const handleSubmit = async () => {
		try {
			if (form.isValid()) {
				setSending(true);

				const parsed = await decrypt(getUrlParam("token")).catch((e) => {
					throw new Error("Link is broken, expired or already used");
				});

				const response = await userUpdate(
					{ password: form.values.password.initial.trim(), id: parsed.userId },
					{ password: "reset", token: getUrlParam("token") }
				);

				if (!response) throw new Error("No response from server");

				const result = await response.json();

				form.reset();

				if (response.ok) {
					// redirect to sign in
					setTimeout(async () => router.push(setRedirectUrl()), timeout.redirect);

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
