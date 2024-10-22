import IconNotificationError from "@/components/common/icons/notification/error";
import IconNotificationSuccess from "@/components/common/icons/notification/success";
import { updateAccountNotifications } from "@/handlers/request/user/account";
import { useForm, UseFormReturnType } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

export const useFormUserAccountNotifications = () => {
	const [sending, setSending] = useState(false);

	const form: UseFormReturnType<any> = useForm({
		initialValues: {
			settings: ""
		}
	});

	const handleSubmit = async () => {
		try {
			if (form.isValid()) {
				setSending(true);

				const result = await updateAccountNotifications(form.values);

				if (!result) {
					notifications.show({
						id: "notifications-update-failed-no-response",
						icon: IconNotificationError(),
						title: "Server Unavailable",
						message: `There was no response from the server.`,
						variant: "failed"
					});
				} else {
					notifications.show({
						id: "notifications-update-success",
						withCloseButton: false,
						icon: IconNotificationSuccess(),
						title: "Password Changed",
						message: `You have successfully cahnged your password.`,
						variant: "success"
					});

					form.reset();
				}
			}
		} catch (error) {
			notifications.show({
				id: "notifications-update-failed",
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
