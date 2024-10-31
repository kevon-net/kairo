import { signUp as handleSignUp } from "@/handlers/request/auth/sign-up";
import { signIn as authSignIn } from "next-auth/react";
import { SignUp as FormAuthSignUp } from "@/types/form";
import { capitalizeWords } from "@/utilities/formatters/string";
import compare from "@/utilities/validators/special/compare";
import email from "@/utilities/validators/special/email";
import password from "@/utilities/validators/special/password";
import text from "@/utilities/validators/special/text";
import { useForm, UseFormReturnType } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { timeout } from "@/data/constants";
import { showNotification } from "@/utilities/notifications";
import { NotificationVariant } from "@/types/enums";

export const useFormAuthSignUp = () => {
	const router = useRouter();

	const [submitted, setSubmitted] = useState(false);

	const form: UseFormReturnType<FormAuthSignUp> = useForm({
		initialValues: {
			name: { first: "", last: "" },
			email: "",
			password: { initial: "", confirm: "" },
		},

		validate: {
			name: {
				first: (value) => text(value.trim(), 2, 24),
				last: (value) => text(value.trim(), 2, 24),
			},
			email: (value) => email(value.trim()),
			password: {
				initial: (value) => password(value.trim(), 8, 24),
				confirm: (value, values) => compare.string(values.password.initial, value, "Password"),
			},
		},
	});

	const parseValues = () => {
		return {
			name: {
				first: capitalizeWords(form.values.name.first.trim()),
				last: capitalizeWords(form.values.name.last.trim()),
			},
			email: form.values.email.trim().toLowerCase(),
			password: {
				initial: form.values.password.initial,
				confirm: form.values.password.confirm,
			},
			verified: false,
		};
	};

	const handleSubmit = async () => {
		if (form.isValid()) {
			try {
				setSubmitted(true);

				const response = await handleSignUp(parseValues());

				if (!response) {
					throw new Error("No response from server");
				}

				const result = await response.json();

				form.reset();

				if (response.ok) {
					// redirect to verification page
					router.push(`/auth/verify/${result.user.id}`);
					return;
				}

				if (response.statusText === "User Exists") {
					setTimeout(async () => {
						// check if user is verified
						if (result.user.verified) {
							// redirect to sign in
							await authSignIn();
						}

						// redirect to verification page
						router.push(`/auth/verify/${result.user.id}`);
					}, timeout.redirect);

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

	return { form, handleSubmit, submitted };
};
