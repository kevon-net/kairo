import { SignIn as FormAuthSignin } from "@/types/form";
import { getCallbackUrlParameter } from "@/utilities/helpers/url";
import email from "@/utilities/validators/special/email";
import { useForm, UseFormReturnType } from "@mantine/form";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { timeout } from "@/data/constants";
import { showNotification } from "@/utilities/notifications";
import { NotificationVariant } from "@/types/enums";
import { setDeviceInfo } from "@/utilities/helpers/cookies";
import { getGeoData } from "@/services/api/geo";
import { useOs } from "@mantine/hooks";

export const useFormAuthSignIn = () => {
	const router = useRouter();
	const os = useOs();

	const [submitted, setSubmitted] = useState(false);

	const form: UseFormReturnType<FormAuthSignin> = useForm({
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
			rememberMe: form.values.remember,
		};
	};

	const handleSubmit = async () => {
		if (form.isValid()) {
			try {
				setSubmitted(true);

				// create cookie with device info
				const geoData = await getGeoData();
				setDeviceInfo(JSON.stringify({ ...geoData, os }));

				// handle user sign in
				const result = await signIn("credentials", {
					...parseValues(),
					redirect: false,
					callbackUrl: getCallbackUrlParameter(),
				});

				if (!result) throw new Error("No response from server");

				form.reset();

				if (!result.error) {
					// apply callbackurl
					result.url && window.location.replace(result.url);
					return;
				}

				if (result.error == "User not found" || result.error == "Invalid username/password") {
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
