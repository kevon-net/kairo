import IconNotification from "@/components/common/icons/notification";
// import { updateAccountNotifications } from "@/handlers/request/database/notifications";
import { NotificationVariant } from "@/types/enums";
import { useForm, UseFormReturnType } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

export const useFormUserAccountNotifications = () => {
	const [sending, setSending] = useState(false);

	const form: UseFormReturnType<any> = useForm({
		initialValues: {
			settings: "",
		},
	});

	const handleSubmit = async () => {
		try {
			if (form.isValid()) {
				setSending(true);

				// const response = await updateAccountNotifications(form.values);
				// const result = await response.json();
			}
		} catch (error) {
			notifications.show({
				id: "notifications-update-failed",
				icon: IconNotification({ variant: NotificationVariant.FAILED }),
				title: `Send Failed`,
				message: (error as Error).message,
				variant: "failed",
			});
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
