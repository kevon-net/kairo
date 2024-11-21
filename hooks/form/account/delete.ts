import { useForm } from "@mantine/form";
import { useState } from "react";
import { NotificationVariant } from "@/types/enums";
import { showNotification } from "@/utilities/notifications";
import { timeout } from "@/data/constants";
import { userDelete } from "@/handlers/requests/database/user";
import { useSession, useSignOut } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import { setRedirectUrl } from "@/utilities/helpers/url";
import { useNetwork } from "@mantine/hooks";

export const useFormUserAccountDelete = () => {
	const [submitted, setSubmitted] = useState(false);
	const { session, pathname } = useSession();
	const { signOut } = useSignOut();
	const networkStatus = useNetwork();

	const router = useRouter();

	const form = useForm({
		initialValues: { confirmation: "", password: "" },
		validate: {
			confirmation: (value) => value.trim() != "DELETE" && "Please enter the confirmation phrase",
		},
	});

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

				setSubmitted(true);

				const response = await userDelete(session?.user.id!, form.values.password.trim());

				if (!response) throw new Error("No response from server");

				const result = await response.json();

				form.reset();

				if (response.ok) {
					// sign out
					setTimeout(async () => await signOut(), timeout.redirect);

					showNotification({ variant: NotificationVariant.SUCCESS }, response, result);
					return;
				}

				if (response.status === 401) {
					// redirect to sign in
					setTimeout(async () => router.push(setRedirectUrl(pathname)), timeout.redirect);

					showNotification({ variant: NotificationVariant.WARNING }, response, result);
					return;
				}

				if (response.status === 404) {
					// sign out
					setTimeout(async () => await signOut(), timeout.redirect);

					showNotification({ variant: NotificationVariant.WARNING }, response, result);
					return;
				}

				showNotification({ variant: NotificationVariant.FAILED }, response, result);
				return;
			} catch (error) {
				showNotification({ variant: NotificationVariant.FAILED, desc: (error as Error).message });
				return;
			} finally {
				setSubmitted(false);
			}
		}
	};

	return {
		form,
		submitted,
		handleSubmit,
	};
};
