import { useForm, UseFormReturnType } from "@mantine/form";
import { useState } from "react";
import { AccountDelete } from "@/types/form";
import { NotificationVariant } from "@/types/enums";
import { showNotification } from "@/utilities/notifications";
import { timeout } from "@/data/constants";
import { userDelete } from "@/handlers/requests/database/user";
import { useSession, useSignOut } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import { setRedirectUrl } from "@/utilities/helpers/url";

export const useFormUserAccountDelete = () => {
	const [submitted, setSubmitted] = useState(false);
	const { session, pathname } = useSession();
	const signOut = useSignOut();

	const router = useRouter();

	const form: UseFormReturnType<AccountDelete> = useForm({ initialValues: { password: "" } });

	if (!session) return;

	const handleSubmit = async () => {
		if (form.isValid()) {
			try {
				setSubmitted(true);

				const response = await userDelete(session.user.id, form.values.password);

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
