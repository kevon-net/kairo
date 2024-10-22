import { passwordForgot, passwordReset } from "@/handlers/request/auth/password";
import { millToMinSec, MinSec } from "@/utilities/formatters/number";
import email from "@/utilities/validators/special/email";
import { useForm, UseFormReturnType } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";

import IconNotificationError from "@/components/common/icons/notification/error";
import IconNotificationSuccess from "@/components/common/icons/notification/success";
import { authUrls } from "@/data/constants";
import password from "@/utilities/validators/special/password";
import compare from "@/utilities/validators/special/compare";
import { signOut as handleSignOut } from "@/handlers/event/sign-out";
import { PasswordForgot as FormAuthPasswordForgot, PasswordReset as FormAuthPasswordReset } from "@/types/form";

export const useFormAuthPasswordForgot = () => {
	const [sending, setSending] = useState(false);
	const [requested, setRequested] = useState(false);
	const [time, setTime] = useState<MinSec | null>(null);

	const form: UseFormReturnType<FormAuthPasswordForgot> = useForm({
		initialValues: { email: "" },
		validate: { email: (value) => email(value) }
	});

	const parseValues = () => {
		return { email: form.values.email.trim().toLowerCase() };
	};

	const router = useRouter();

	const handleSubmit = async () => {
		try {
			if (form.isValid()) {
				setSending(true);
				setRequested(true);

				const result = await passwordForgot(parseValues());

				if (!result) {
					notifications.show({
						id: "password-forgot-failed-no-response",
						icon: IconNotificationError(),
						title: "Server Unavailable",
						message: `There was no response from the server.`,
						variant: "failed"
					});
				} else {
					if (!result.user.exists) {
						notifications.show({
							id: "password-forgot-failed-not-found",
							icon: IconNotificationError(),
							title: `Not Found`,
							message: `No account with the provided email exists.`,
							variant: "failed"
						});

						form.reset();

						// redirect to sign up page
						router.replace("/auth/sign-up");
					} else {
						if (!result.user.otl.exists) {
							form.reset();

							// redirect to notification page
							router.replace(authUrls.verify);
						} else {
							if (!result.user.otl.expired) {
								if (!result.user.otl.valid) {
									// update time
									setTime(millToMinSec(result.user.otl.expiry)!);
								} else {
									setTime(null);
									form.reset();

									// redirect to notification page
									router.replace(authUrls.verify);
								}
							} else {
								setTime(null);
								form.reset();

								// redirect to notification page
								router.replace(authUrls.verify);
							}
						}
					}
				}
			}
		} catch (error) {
			notifications.show({
				id: "password-forgot-failed",
				icon: IconNotificationError(),
				title: `Send Failed`,
				message: (error as Error).message,
				variant: "failed"
			});

			form.reset();
		} finally {
			setSending(false);
			setRequested(false);
		}
	};

	return { form, handleSubmit, sending, requested, time };
};

export const useFormAuthPasswordReset = (params: { userId: string; token: string }) => {
	const [sending, setSending] = useState(false);

	const form: UseFormReturnType<FormAuthPasswordReset> = useForm({
		initialValues: {
			password: "",
			passwordConfirm: ""
		},

		validate: {
			password: (value) => password(value, 8, 24),
			passwordConfirm: (value, values) => compare.string(value, values.password, "Password")
		}
	});

	const parseValues = () => {
		return { password: form.values.password };
	};

	const router = useRouter();

	const handleSubmit = async () => {
		try {
			if (form.isValid()) {
				setSending(true);

				const result = await passwordReset(parseValues(), params);

				if (!result) {
					notifications.show({
						id: "password-reset-failed-no-response",
						icon: IconNotificationError(),
						title: "Server Unavailable",
						message: `There was no response from the server.`,
						variant: "failed"
					});
				} else {
					if (!result.user.exists) {
						notifications.show({
							id: "password-reset-failed-not-found",
							icon: IconNotificationError(),
							title: `Not Found`,
							message: `You are not allowed to perform this function.`,
							variant: "failed"
						});

						form.reset();

						// redirect to sign up page
						router.replace("/auth/sign-up");
					} else {
						if (!result.token.valid) {
							notifications.show({
								id: "password-reset-failed-invalid",
								icon: IconNotificationError(),
								title: `Invalid Link`,
								message: `The link is broken, expired or already used.`,
								variant: "failed"
							});

							form.reset();

							// redirect to forgot password page
							router.replace("/auth/password/forgot");
						} else {
							if (!result.user.password.matches) {
								notifications.show({
									id: "password-reset-success",
									withCloseButton: false,
									icon: IconNotificationSuccess(),
									title: "Password Changed",
									message: `You have successfully changed your password.`,
									variant: "success"
								});

								form.reset();

								// sign out and redirect to sign in page
								await handleSignOut({
									redirectUrl: authUrls.signIn
								});
							} else {
								notifications.show({
									id: "password-reset-failed-unauthorized",
									icon: IconNotificationError(),
									title: `Parity Not Allowed`,
									message: `New and previous password can't be the same.`,
									variant: "failed"
								});

								form.reset();
							}
						}
					}
				}
			}
		} catch (error) {
			notifications.show({
				id: "password-reset-failed",
				icon: IconNotificationError(),
				title: `Send Failed`,
				message: (error as Error).message,
				variant: "failed"
			});
		} finally {
			setSending(false);
		}
	};

	return { form, handleSubmit, sending };
};
