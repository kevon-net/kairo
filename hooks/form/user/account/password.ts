import IconNotificationError from "@/components/common/icons/notification/error";
import IconNotificationSuccess from "@/components/common/icons/notification/success";
import { useForm, UseFormReturnType } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { signOut as handleSignOut } from "@/handlers/event/sign-out";
import password from "@/utilities/validators/special/password";
import compare from "@/utilities/validators/special/compare";
import { AccountPassword, PasswordReset } from "@/types/form";
import { updateAccountPassword } from "@/handlers/request/user/account";
import { authUrls } from "@/data/constants";

export const useFormUserAccountPassword = () => {
	const [sending, setSending] = useState(false);

	const form: UseFormReturnType<PasswordReset & { passwordCurrent: string }> = useForm({
		initialValues: {
			password: "",
			passwordConfirm: "",

			passwordCurrent: ""
		},

		validate: {
			passwordCurrent: (value) => password(value, 8, 24),
			password: (value, values) =>
				value == values.passwordCurrent
					? "Current and new passwords cannot be the same"
					: password(value, 8, 24),
			passwordConfirm: (value, values) => compare.string(value, values.password, "Password")
		}
	});

	const parseValues = (): AccountPassword => {
		return {
			passwordCurrent: form.values.passwordCurrent,
			passwordNew: form.values.password
		};
	};

	const handleSubmit = async () => {
		try {
			if (form.isValid()) {
				setSending(true);

				const result = await updateAccountPassword(parseValues());

				if (!result) {
					notifications.show({
						id: "password-update-failed-no-response",
						icon: IconNotificationError(),
						title: "Server Unavailable",
						message: `There was no response from the server.`,
						variant: "failed"
					});
				} else {
					if (!result.user.exists) {
						notifications.show({
							id: "password-update-failed-not-found",
							icon: IconNotificationError(),
							title: `Not Found`,
							message: `The account is not valid.`,
							variant: "failed"
						});

						// sign out and redirect to sign in page
						await handleSignOut({ redirectUrl: authUrls.signIn });
					} else {
						if (!result.user.password.match) {
							notifications.show({
								id: "password-update-failed-unauthorized",
								icon: IconNotificationError(),
								title: `Unauthorized`,
								message: `You've entered the wrong password.`,
								variant: "failed"
							});
						} else {
							notifications.show({
								id: "password-update-success",
								withCloseButton: false,
								icon: IconNotificationSuccess(),
								title: "Password Changed",
								message: `You have successfully cahnged your password.`,
								variant: "success"
							});
						}

						form.reset();
					}
				}
			}
		} catch (error) {
			notifications.show({
				id: "password-update-failed",
				icon: IconNotificationError(),
				title: `Send Failed`,
				message: (error as Error).message,
				variant: "failed"
			});
		} finally {
			setSending(false);
		}
	};

	return {
		form,
		sending,
		handleSubmit
	};
};
