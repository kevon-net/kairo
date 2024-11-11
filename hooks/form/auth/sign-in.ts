import { getRedirectUrl } from "@/utilities/helpers/url";
import email from "@/utilities/validators/special/email";
import { useForm, UseFormReturnType } from "@mantine/form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cookieName, timeout } from "@/data/constants";
import { showNotification } from "@/utilities/notifications";
import { NotificationVariant } from "@/types/enums";
import { getGeoData } from "@/services/api/geo";
import { useOs } from "@mantine/hooks";
import { signIn } from "@/handlers/requests/auth/sign-in";
import { Credentials } from "@/types/auth";
import { setCookie } from "@/utilities/helpers/cookie";

export const useFormAuthSignIn = () => {
	const router = useRouter();
	const os = useOs();

	const [submitted, setSubmitted] = useState(false);

	const form: UseFormReturnType<Credentials & { remember: false }> = useForm({
		initialValues: {
			email: "",
			password: "",
			remember: false,
		},

		validate: {
			email: (value) => email(value.trim()),
			password: (value) => (value.trim().length > 0 ? null : "Please fill out this field"),
		},
	});

	const parseValues = () => {
		return {
			email: form.values.email.trim().toLowerCase(),
			password: form.values.password.trim(),
			remember: form.values.remember,
		};
	};

	const handleSubmit = async () => {
		if (form.isValid()) {
			try {
				setSubmitted(true);

				// create cookie with device info
				const geoData = await getGeoData();
				setCookie(cookieName.device.geo, { ...geoData, os }, { expiryInSeconds: 30 });

				const response = await signIn({ credentials: parseValues() });
				const result = await response.json();

				if (!result) throw new Error("No response from server");

				form.reset();

				if (!result.error) {
					// apply redirect url
					window.location.replace(getRedirectUrl());
					return;
				}

				if (response.status == 404 || response.status == 401) {
					showNotification({
						variant: NotificationVariant.FAILED,
						title: "Authentication Error",
						desc: "Invalid username/password",
					});
					return;
				}

				if (result.error.includes("User not Verified")) {
					const userId = result.error.split(": ")[1];

					// redirect to verification page
					setTimeout(() => router.push(`/auth/verify/${userId}`), timeout.redirect);

					showNotification(
						{
							variant: NotificationVariant.WARNING,
							title: "Not Verified",
							desc: "User not verified. Redirecting...",
						},
						undefined,
						result
					);
					return;
				}

				throw new Error("An unexpected error occured");
			} catch (error) {
				showNotification({ variant: NotificationVariant.FAILED, desc: (error as Error).message });
				return;
			} finally {
				setSubmitted(false);
			}
		}
	};

	return { form, submitted, handleSubmit };
};
