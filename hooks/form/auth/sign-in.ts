import { SignIn as FormAuthSignin } from "@/types/form";
import { getCallbackUrlParameter } from "@/utilities/helpers/url";
import email from "@/utilities/validators/special/email";
import { useForm, UseFormReturnType } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { signIn } from "next-auth/react";
import { useState } from "react";
import IconNotificationError from "@/components/common/icons/notification/error";

export const useFormAuthSignIn = () => {
	const [submitted, setSubmitted] = useState(false);

	const form: UseFormReturnType<FormAuthSignin> = useForm({
		initialValues: {
			email: "",
			password: "",
			remember: false
		},

		validate: {
			email: (value) => email(value.trim()),
			password: (value) =>
				value.trim().length > 0 ? null : "Please fill out this field"
		}
	});

	const parseValues = () => {
		return {
			email: form.values.email.trim().toLowerCase(),
			password: form.values.password.trim(),
			rememberMe: form.values.remember
		};
	};

	const handleSubmit = async () => {
		if (form.isValid()) {
			try {
				setSubmitted(true);

				const result = await signIn("credentials", {
					...parseValues(),
					redirect: false,
					callbackUrl: getCallbackUrlParameter()
				});

				if (!result?.ok) {
					notifications.show({
						id: "sign-in-failed-bad-response",
						icon: IconNotificationError(),
						title: "Bad Response",
						message: "There was a problem with the request",
						variant: "failed"
					});
				} else {
					if (!result.error) {
						// apply callbackurl
						result.url && window.location.replace(result.url);
					} else {
						notifications.show({
							id: `sign-in-failed-${result.error}`,
							icon: IconNotificationError(),
							title: "Authentication Error",
							message: "Incorrect username/password",
							variant: "failed"
						});
					}
				}
			} catch (error) {
				notifications.show({
					id: "sign-in-failed-unexpected",
					icon: IconNotificationError(),
					title: "Unexpected Error",
					message: (error as Error).message,
					variant: "failed"
				});
			} finally {
				form.reset();
				setSubmitted(false);
			}
		}
	};

	return { form, submitted, handleSubmit };
};
