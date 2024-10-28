import IconNotificationError from "@/components/common/icons/notification/error";
import IconNotificationSuccess from "@/components/common/icons/notification/success";
import { signIn as handleSignIn } from "@/handlers/event/sign-in";
import { signUp as handleSignUp } from "@/handlers/request/auth/sign-up";
import { SignUp as FormAuthSignUp } from "@/types/form";
import { capitalizeWords } from "@/utilities/formatters/string";
import compare from "@/utilities/validators/special/compare";
import email from "@/utilities/validators/special/email";
import password from "@/utilities/validators/special/password";
import text from "@/utilities/validators/special/text";
import { useForm, UseFormReturnType } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

export const useFormAuthSignUp = () => {
	const [submitted, setSubmitted] = useState(false);

	const form: UseFormReturnType<FormAuthSignUp> = useForm({
		initialValues: {
			name: { first: "", last: "" },
			email: "",
			password: { initial: "", confirm: "" }
		},

		validate: {
			name: {
				first: (value) => text(value.trim(), 2, 24),
				last: (value) => text(value.trim(), 2, 24)
			},
			email: (value) => email(value.trim()),
			password: {
				initial: (value) => password(value.trim(), 8, 24),
				confirm: (value, values) => compare.string(values.password.initial, value, "Password")
			}
		}
	});

	const parseValues = () => {
		return {
			name: {
				first: capitalizeWords(form.values.name.first.trim()),
				last: capitalizeWords(form.values.name.last.trim())
			},
			email: form.values.email.trim().toLowerCase(),
			password: {
				initial: form.values.password.initial.trim(),
				confirm: form.values.password.confirm.trim()
			},
			verified: false
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

				console.log(response);

				const result = await response.json();

				if (!response.ok) {
					notifications.show({
						id: "sign-up-failed",
						icon: IconNotificationError(),
						title: `${response.statusText} (${response.status})`,
						message: result.error,
						variant: "failed"
					});
				} else {
					// if (result.user.exists == false) {
					// 	setSubmitted(false);
					// 	switchContext();
					// } else {
					// 	if (result.user.verified == false) {
					// 		switchContext();
					// 	} else {
					// 		// redirect to sign in
					// 		form.reset();
					// 		await handleSignIn();
					// 	}
					// }
				}
			} catch (error) {
				notifications.show({
					id: "sign-up-failed",
					icon: IconNotificationError(),
					title: "Sign Up Failed",
					message: (error as Error).message,
					variant: "failed"
				});

				// form.reset();
			} finally {
				setSubmitted(false);
			}
		}
	};

	return { form, handleSubmit, submitted };
};
