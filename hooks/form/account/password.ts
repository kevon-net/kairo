import { useForm } from "@mantine/form";
import { useState } from "react";
import password from "@/utilities/validators/special/password";
import compare from "@/utilities/validators/special/compare";
import { userUpdate } from "@/handlers/requests/database/user";
import { timeout } from "@/data/constants";
import { NotificationVariant } from "@/types/enums";
import { showNotification } from "@/utilities/notifications";
import { useSession, useSignOut } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import { setRedirectUrl } from "@/utilities/helpers/url";

export const useFormUserAccountPassword = (params: { credentials: boolean }) => {
	const router = useRouter();

	const { session, updateSession, pathname } = useSession();
	const signOut = useSignOut();

	const [sending, setSending] = useState(false);

	const form = useForm({
		initialValues: {
			current: "",
			password: { initial: "", confirm: "" },
			credentials: params.credentials,
		},

		validate: {
			current: (value) => params.credentials && password(value, 8, 24),
			password: {
				initial: (value, values) =>
					value == values.current ? "Current and new passwords cannot be the same" : password(value, 8, 24),
				confirm: (value, values) => compare.string(value, values.password.initial, "Password"),
			},
		},
	});

	const handleSubmit = async () => {
		try {
			if (form.isValid()) {
				setSending(true);

				const response = await userUpdate(
					{ password: form.values.password.initial.trim(), id: session?.user.id },
					{ password: session?.user.withPassword ? form.values.current.trim() : "update" }
				);

				if (!response) throw new Error("No response from server");

				const result = await response.json();

				form.reset();

				if (response.ok && session) {
					if (!session.user.withPassword) {
						// update the session data on the client-side
						updateSession({ ...session, user: { ...session.user, withPassword: true } });

						// refresh the page
						window.location.reload();

						return;
					}

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

					showNotification({ variant: NotificationVariant.FAILED }, response, result);
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

	return {
		form,
		sending,
		handleSubmit,
	};
};
