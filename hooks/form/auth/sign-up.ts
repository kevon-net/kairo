import IconNotificationError from "@/components/common/icons/notification/error";
import IconNotificationSuccess from "@/components/common/icons/notification/success";
import { signIn as handleSignIn } from "@/handlers/event/sign-in";
import { signUp as handleSignUp } from "@/handlers/request/auth/sign-up";
import { SignUp as FormAuthSignUp, Verify as FormAuthVerify } from "@/types/form";
import { millToMinSec, MinSec } from "@/utilities/formatters/number";
import compare from "@/utilities/validators/special/compare";
import email from "@/utilities/validators/special/email";
import password from "@/utilities/validators/special/password";
import { useForm, UseFormReturnType } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { verify as handleVerify, verifyResend as handleVerifyResend } from "@/handlers/request/auth/verify";

export const useFormAuthSignUp = (params?: { userEmail?: string }) => {
	const [submitted, setSubmitted] = useState(false);
	const [verify, setverify] = useState(params?.userEmail ? true : false);

	// form 1 logic

	const formSignUp: UseFormReturnType<FormAuthSignUp> = useForm({
		initialValues: {
			email: "",
			password: "",
			passwordConfirm: ""
		},

		validate: {
			email: (value) => email(value.trim()),
			password: (value) => password(value.trim(), 8, 24),
			passwordConfirm: (value, values) => compare.string(values.password, value, "Password")
		}
	});

	const parseValuesSignUp = () => {
		return {
			email: formSignUp.values.email.trim().toLowerCase(),
			password: formSignUp.values.password.trim(),
			unverified: true
		};
	};

	const handleSubmitSignUp = async () => {
		if (formSignUp.isValid()) {
			try {
				setSubmitted(true);

				const result = await handleSignUp(parseValuesSignUp());

				if (!result) {
					notifications.show(notification.noResponse);
				} else {
					if (result.user.exists == false) {
						setSubmitted(false);
						switchContext();
					} else {
						if (result.user.verified == false) {
							switchContext();
						} else {
							notifications.show({
								id: "sign-up-failed-exists",
								icon: IconNotificationError(),
								title: "Account Exists",
								message: "An account with that email already exists",
								variant: "failed"
							});

							// redirect to sign in
							formSignUp.reset();
							await handleSignIn();
						}
					}
				}
			} catch (error) {
				notifications.show({
					id: "sign-up-failed",
					icon: IconNotificationError(),
					title: "Sign Up Failed",
					message: (error as Error).message,
					variant: "failed"
				});

				formSignUp.reset();
			} finally {
				setSubmitted(false);
			}
		}
	};

	// form 2 logic

	const [requested, setRequested] = useState(false);
	const [time, setTime] = useState<MinSec | null>(null);

	const formVerify: UseFormReturnType<Omit<FormAuthVerify, "email">> = useForm({
		initialValues: {
			otp: ""
		},

		validate: {
			otp: (value) => (value.length < 1 ? "A code is required" : value.length == 4 ? null : "Invalid code")
		}
	});

	const parseValuesVerify = () => {
		return {
			otp: formVerify.values.otp,
			email: params?.userEmail ? params?.userEmail : formSignUp.values.email
		};
	};

	const handleSubmitVerify = async (formValues: any) => {
		try {
			if (formVerify.isValid()) {
				setSubmitted(true);

				const result = await handleVerify(parseValuesVerify());

				if (!result) {
					notifications.show(notification.noResponse);
				} else {
					if (!result.user.exists) {
						notifications.show(notification.unauthorized);

						// revert context
						formSignUp.reset();
						switchContext();
					} else {
						if (!result.user.verified) {
							if (!result.otp.exists) {
								notifications.show({
									id: "otp-verify-failed-expired",
									icon: IconNotificationError(),
									title: "No OTP Found",
									message: `Request another OTP in the link provided on this page`,
									variant: "failed"
								});

								formVerify.reset();
							} else {
								if (!result.otp.matches) {
									notifications.show({
										id: "otp-verify-failed-mismatch",
										icon: IconNotificationError(),
										title: "Wrong OTP",
										message: `You have entered the wrong OTP for this email.`,
										variant: "failed"
									});

									formVerify.reset();
								} else {
									if (!result.otp.expired) {
										notifications.show({
											id: "otp-verify-success",
											icon: IconNotificationSuccess(),
											title: "Account Created",
											message: `You can now log in to your account.`,
											variant: "success"
										});

										// redirect to sign in
										formSignUp.reset();
										formVerify.reset();
										await handleSignIn();
									} else {
										notifications.show({
											id: "otp-verify-failed-expired",
											icon: IconNotificationError(),
											title: "OTP Expired",
											message: `Request another in the link provided on this page`,
											variant: "failed"
										});

										formVerify.reset();
									}
								}
							}
						} else {
							notifications.show(notification.verified);

							// redirect to sign in
							formSignUp.reset();
							formVerify.reset();
							await handleSignIn();
						}
					}
				}
			}
		} catch (error) {
			notifications.show({
				id: "otp-verify-failed",
				icon: IconNotificationError(),
				title: `Verification Failed`,
				message: (error as Error).message,
				variant: "failed"
			});
		} finally {
			setSubmitted(false);
		}
	};

	const handleRequest = async () => {
		try {
			setRequested(true);

			const result = await handleVerifyResend({ email: formSignUp.values.email });

			if (!result) {
				notifications.show(notification.noResponse);
			} else {
				if (!result.user.exists) {
					notifications.show(notification.unauthorized);

					// revert context
					formSignUp.reset();
					switchContext();
				} else {
					if (!result.user.verified) {
						if (!result.otp.exists) {
							// // test new otp value response
							// console.log(result.otp.value);

							notifications.show({
								id: "otp-request-success-new-otp-created",
								icon: IconNotificationSuccess(),
								title: "New OTP Sent",
								message: `A new code has been sent to the provided email.`,
								variant: "success"
							});

							formVerify.reset();
						} else {
							if (!result.otp.expired) {
								setTime(millToMinSec(result.otp.expiry)!);

								// // test otp tte response
								// console.log(result.otp.time);

								!time &&
									notifications.show({
										id: "otp-request-failed-not-expired",
										icon: IconNotificationError(),
										title: "OTP Already Sent",
										message: `Remember to check your spam/junk folder(s).`,
										variant: "failed"
									});
							} else {
								// // test new otp value response
								// console.log(result.otp.value);

								notifications.show({
									id: "otp-request-success",
									icon: IconNotificationSuccess(),
									title: "New OTP Sent",
									message: `A new code has been sent to the provided email.`,
									variant: "success"
								});

								formVerify.reset();
							}
						}
					} else {
						notifications.show(notification.verified);

						// redirect to sign in
						formSignUp.reset();
						formVerify.reset();
						await handleSignIn();
					}
				}
			}
		} catch (error) {
			notifications.show({
				id: "otp-request-failed",
				icon: IconNotificationError(),
				title: "Request Failed",
				message: (error as Error).message,
				variant: "failed"
			});
		} finally {
			setRequested(false);
		}
	};

	const switchContext = async () => {
		formVerify.reset();
		setverify(!verify);
	};

	return {
		formSignUp,
		formVerify,
		handleSubmitSignUp,
		handleSubmitVerify,
		handleRequest,
		submitted,
		verify,
		requested,
		time,
		switchContext
	};
};

// notifications
const notification = {
	noResponse: {
		id: "otp-verify-failed-no-response",
		icon: IconNotificationError(),
		title: "Server Unreachable",
		message: `Check your network connection.`,
		variant: "failed"
	},
	unauthorized: {
		id: "otp-request-failed-not-found",
		icon: IconNotificationError(),
		title: "Unauthorized",
		message: `You are not allowed to perform this action.`,
		variant: "failed"
	},
	verified: {
		id: "otp-request-info-already-verified",
		icon: IconNotificationSuccess(),
		title: "Verified",
		message: `The email has already been verified`,
		variant: "success"
	}
};
