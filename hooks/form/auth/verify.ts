import { Verify as FormAuthVerify } from "@/types/form";
import { millToMinSec, MinSec } from "@/utilities/formatters/number";
import { useForm, UseFormReturnType } from "@mantine/form";
import { useState } from "react";
import { verify as handleVerify, verifyResend as handleVerifyResend } from "@/handlers/requests/auth/verify";
import { useRouter } from "next/navigation";
import { timeout } from "@/data/constants";
import { NotificationVariant } from "@/types/enums";
import { showNotification } from "@/utilities/notifications";

export const useFormAuthVerify = (params: { userId: string }) => {
	const router = useRouter();

	const [submitted, setSubmitted] = useState(false);
	const [requested, setRequested] = useState(false);
	const [time, setTime] = useState<MinSec | null>(null);

	const form: UseFormReturnType<Omit<FormAuthVerify, "userId">> = useForm({
		initialValues: { otp: "" },

		validate: {
			otp: (value) => value.length != 6 && true,
		},
	});

	const parseValues = () => {
		return { otp: form.values.otp, userId: params.userId };
	};

	const handleSubmit = async () => {
		try {
			if (form.isValid()) {
				setSubmitted(true);

				const response = await handleVerify(parseValues());

				if (!response) throw new Error("No response from server");

				const result = await response.json();

				setTime(null);
				form.reset();

				if (response.ok) {
					// // redirect to sign in page
					// setTimeout(async () => await authSignIn(), timeout.redirect);

					showNotification({ variant: NotificationVariant.SUCCESS }, response, result);
					return;
				}

				if (response.status === 404) {
					// redirect to home page
					setTimeout(() => router.push("/"), timeout.redirect);

					showNotification({ variant: NotificationVariant.FAILED }, response, result);
					return;
				}

				if (response.statusText === "Already Verified") {
					// // redirect to sign in page
					// setTimeout(async () => await authSignIn(), timeout.redirect);

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
			setSubmitted(false);
		}
	};

	const handleRequest = async () => {
		try {
			setRequested(true);

			const response = await handleVerifyResend({ userId: params.userId });

			if (!response) throw new Error("No response from server");

			const result = await response.json();

			form.reset();

			if (response.ok) {
				setTime(null);

				showNotification({ variant: NotificationVariant.SUCCESS }, response, result);
				return;
			}

			if (response.statusText === "Already Sent") {
				setTime(millToMinSec(result.otp.expiry)!);

				showNotification({ variant: NotificationVariant.WARNING }, response, result);
				return;
			}

			setTime(null);

			if (response.status === 404) {
				// redirect to home page
				setTimeout(() => router.replace("/"), timeout.redirect);

				showNotification({ variant: NotificationVariant.FAILED }, response, result);
				return;
			}

			if (response.statusText === "Already Verified") {
				// // redirect to sign in page
				// setTimeout(async () => await authSignIn(), timeout.redirect);

				showNotification({ variant: NotificationVariant.WARNING }, response, result);
				return;
			}

			showNotification({ variant: NotificationVariant.FAILED }, response, result);
			return;
		} catch (error) {
			showNotification({ variant: NotificationVariant.FAILED, desc: (error as Error).message });
			return;
		} finally {
			setRequested(false);
		}
	};

	return {
		form,
		handleSubmit,
		handleRequest,
		submitted,
		requested,
		time,
	};
};
