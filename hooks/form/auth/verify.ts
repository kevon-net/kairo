import IconNotificationError from "@/components/common/icons/notification/error";
import IconNotificationSuccess from "@/components/common/icons/notification/success";
import { signIn as handleSignIn } from "@/handlers/event/sign-in";
import { Verify as FormAuthVerify } from "@/types/form";
import { millToMinSec, MinSec } from "@/utilities/formatters/number";
import { useForm, UseFormReturnType } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { verify as handleVerify, verifyResend as handleVerifyResend } from "@/handlers/request/auth/verify";
import { useRouter } from "next/navigation";

export const useFormAuthVerify = (params: { userId: string }) => {
	const [submitted, setSubmitted] = useState(false);

	const [requested, setRequested] = useState(false);
	const [time, setTime] = useState<MinSec | null>(null);

	const router = useRouter();

	const form: UseFormReturnType<Omit<FormAuthVerify, "userId">> = useForm({
		initialValues: { otp: "" },

		validate: {
			otp: (value) => (value.length < 1 ? "A code is required" : value.length == 6 ? null : "Invalid code")
		}
	});

	const parseValues = () => {
		return { otp: form.values.otp, userId: params.userId };
	};

	const handleSubmit = async () => {
		try {
			if (form.isValid()) {
				setSubmitted(true);

				const result = await handleVerify(parseValues());

				if (!result) {
					notifications.show(notification.noResponse);
				} else {
					if (!result.user.exists) {
						notifications.show(notification.unauthorized);

						// redirect to sign up page
						router.push("/auth/sign-up");
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

								form.reset();
							} else {
								if (!result.otp.matches) {
									notifications.show({
										id: "otp-verify-failed-mismatch",
										icon: IconNotificationError(),
										title: "Wrong OTP",
										message: `You have entered the wrong OTP for this email.`,
										variant: "failed"
									});

									form.reset();
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
										form.reset();
										await handleSignIn();
									} else {
										notifications.show({
											id: "otp-verify-failed-expired",
											icon: IconNotificationError(),
											title: "OTP Expired",
											message: `Request another in the link provided on this page`,
											variant: "failed"
										});

										form.reset();
									}
								}
							}
						} else {
							notifications.show(notification.verified);

							// redirect to sign in
							form.reset();
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

			const result = await handleVerifyResend({ userId: params.userId });

			if (!result) {
				notifications.show(notification.noResponse);
			} else {
				if (!result.user.exists) {
					notifications.show(notification.unauthorized);

					// redirect to sign up page
					router.push("/auth/sign-up");
				} else {
					if (!result.user.verified) {
						if (!result.otp.exists) {
							notifications.show({
								id: "otp-request-success-new-otp-created",
								icon: IconNotificationSuccess(),
								title: "New OTP Sent",
								message: `A new code has been sent to the provided email.`,
								variant: "success"
							});

							form.reset();
						} else {
							if (!result.otp.expired) {
								setTime(millToMinSec(result.otp.expiry)!);

								!time &&
									notifications.show({
										id: "otp-request-failed-not-expired",
										icon: IconNotificationError(),
										title: "OTP Already Sent",
										message: `Remember to check your spam/junk folder(s).`,
										variant: "failed"
									});
							} else {
								notifications.show({
									id: "otp-request-success",
									icon: IconNotificationSuccess(),
									title: "New OTP Sent",
									message: `A new code has been sent to the provided email.`,
									variant: "success"
								});

								form.reset();
							}
						}
					} else {
						notifications.show(notification.verified);

						// redirect to sign in
						form.reset();
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

	return {
		form,
		handleSubmit,
		handleRequest,
		submitted,
		requested,
		time,
		router
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
