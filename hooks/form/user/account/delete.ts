import IconNotificationError from "@/components/common/icons/notification/error";
import IconNotificationSuccess from "@/components/common/icons/notification/success";
import { useForm, UseFormReturnType } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { deleteAccount } from "@/handlers/request/user/account";
import { signOut as handleSignOut } from "@/handlers/event/sign-out";
import { AccountDelete } from "@/types/form";

export const useFormUserAccountDelete = () => {
	const [submitted, setSubmitted] = useState(false);

	const form: UseFormReturnType<AccountDelete> = useForm({
		initialValues: {
			password: ""
		}
	});

	const parseValues = () => {
		return {
			password: form.values.password
		};
	};

	const handleSubmit = async () => {
		if (form.isValid()) {
			try {
				setSubmitted(true);

				const result = await deleteAccount(parseValues());

				if (!result) {
					notifications.show({
						id: "account-deletion-failed-no-response",
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
							message: `The account is not valid.`,
							variant: "failed"
						});

						form.reset();
						await handleSignOut({ redirectUrl: "/" });
					} else {
						if (!result.user.password.match) {
							notifications.show({
								id: "password-reset-failed-not-found",
								icon: IconNotificationError(),
								title: `Authentication Error`,
								message: `Incorrect password provided.`,
								variant: "failed"
							});

							form.reset();
						} else {
							notifications.show({
								id: "account-deletion-success",
								icon: IconNotificationSuccess(),
								title: "Account Deleted",
								message: "Your account has been successfully deleted",
								variant: "success"
							});

							form.reset();
							await handleSignOut({ redirectUrl: "/" });
						}
					}
				}
			} catch (error) {
				notifications.show({
					id: "account-deletion-failed",
					icon: IconNotificationError(),
					title: "Submisstion Failed",
					message: (error as Error).message,
					variant: "failed"
				});
			} finally {
				setSubmitted(false);
			}
		}
	};

	return {
		form,
		submitted,
		handleSubmit
	};
};
