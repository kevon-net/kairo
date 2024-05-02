"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { Box, Button, Center, Grid, GridCol, PinInput, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import hook from "@/hooks";

import { typeRemaining, typeVerify } from "@/types/form";

import { signIn } from "next-auth/react";
import millToMinSec from "@/utilities/converters/millMinSec";

export default function Verify({ userId }: { userId: string }) {
	const [sending, setSending] = useState(false);
	const [requested, setRequested] = useState(false);
	const [time, setTime] = useState<typeRemaining>();

	const router = useRouter();

	const form = useForm({
		initialValues: {
			otp: "",
		},

		validate: {
			otp: value => value.length != 4,
		},
	});

	const parse = (rawData: typeVerify) => {
		return { otp: rawData.otp, userId };
	};

	const handleSubmit = async (formValues: typeVerify) => {
		try {
			if (form.isValid()) {
				setSending(true);

				await hook.request
					.post(`http://localhost:3000/api/${userId}/auth/verify`, {
						method: "POST",
						body: JSON.stringify(parse(formValues)),
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json",
						},
					})
					.then(res => {
						if (!res) {
							notifications.show({
								id: "otp-verify-failed-no-response",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Server Unavailable",
								message: `There was no response from the server.`,
								variant: "failed",
							});
						} else {
							if (!res.user) {
								notifications.show({
									id: "otp-verify-failed-invalid",
									icon: <IconX size={16} stroke={1.5} />,
									autoClose: 5000,
									title: "Unauthorized",
									message: `You are not allowed to perform this action.`,
									variant: "failed",
								});

								router.replace("/auth/sign-up");
							} else {
								if (!res.user.verified) {
									if (!res.user.otp) {
										notifications.show({
											id: "otp-verify-failed-expired",
											icon: <IconX size={16} stroke={1.5} />,
											autoClose: 5000,
											title: "OTP Expired",
											message: `Request another in the link provided on this page`,
											variant: "failed",
										});

										form.reset();
									} else {
										if (!res.user.otp.match) {
											notifications.show({
												id: "otp-verify-failed-mismatch",
												icon: <IconX size={16} stroke={1.5} />,
												autoClose: 5000,
												title: "Wrong OTP",
												message: `You have entered the wrong OTP for this email.`,
												variant: "failed",
											});

											form.reset();
										} else {
											if (!res.user.otp.expired) {
												notifications.show({
													id: "otp-verify-success",
													icon: <IconCheck size={16} stroke={1.5} />,
													autoClose: 5000,
													title: "Email Verified",
													message: `You can now log in to your account.`,
													variant: "success",
												});

												// router.replace(`/auth/sign-in`);
												signIn();
											} else {
												notifications.show({
													id: "otp-verify-failed-expired",
													icon: <IconX size={16} stroke={1.5} />,
													autoClose: 5000,
													title: "OTP Expired",
													message: `Request another in the link provided on this page`,
													variant: "failed",
												});

												form.reset();
											}
										}
									}
								} else {
									notifications.show({
										id: "otp-verify-success",
										icon: <IconCheck size={16} stroke={1.5} />,
										autoClose: 5000,
										title: "Verified",
										message: `The email has already been verified`,
										variant: "success",
									});

									// router.replace(`/auth/sign-in`);
									signIn();
								}
							}
						}
					});
			}
		} catch (error) {
			console.error("Error:", (error as Error).message);

			notifications.show({
				id: "otp-verify-failed",
				icon: <IconX size={16} stroke={1.5} />,
				autoClose: 5000,
				title: `Verification Failed`,
				message: (error as Error).message,
				variant: "failed",
			});
		} finally {
			setSending(false);
		}
	};

	const handleRequest = async () => {
		try {
			setRequested(true);

			await hook.request
				.post(`http://localhost:3000/api/${userId}/auth/verify/resend`, {
					method: "POST",
					body: JSON.stringify({ userId }),
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				})
				.then(res => {
					if (!res) {
						notifications.show({
							id: "otp-request-failed-no-response",
							icon: <IconX size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "Server Unavailable",
							message: `There was no response from the server.`,
							variant: "failed",
						});
					} else {
						if (!res.user) {
							notifications.show({
								id: "otp-request-failed-not-found",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Unauthorized",
								message: `You are not allowed to perform this action.`,
								variant: "failed",
							});

							router.replace(`/auth/sign-up`);
						} else {
							if (!res.user.verified) {
								if (!res.user.otp) {
									notifications.show({
										id: "otp-request-success-new-otp-created",
										icon: <IconCheck size={16} stroke={1.5} />,
										autoClose: 5000,
										title: "New OTP Sent",
										message: `A new code has been sent to the provided email.`,
										variant: "success",
									});
								} else {
									if (!res.user.otp.expired) {
										notifications.show({
											id: "otp-request-failed-not-expired",
											icon: <IconX size={16} stroke={1.5} />,
											autoClose: 5000,
											title: "Already Sent",
											message: `Remember to check the spam/junk folder(s).`,
											variant: "failed",
										});

										setTime(millToMinSec(parseInt(res.user.otp.expires) - Date.now()));
									} else {
										notifications.show({
											id: "otp-request-success",
											icon: <IconCheck size={16} stroke={1.5} />,
											autoClose: 5000,
											title: "New OTP Sent",
											message: `A new code has been sent to the provided email.`,
											variant: "success",
										});
									}
								}
							} else {
								notifications.show({
									id: "otp-request-info-already-verified",
									icon: <IconCheck size={16} stroke={1.5} />,
									autoClose: 5000,
									title: "Verified",
									message: `The email has already been verified`,
									variant: "success",
								});

								// router.replace(`/auth/sign-in`);
								signIn();
							}
						}
					}
				});
		} catch (error) {
			notifications.show({
				id: "otp-request-failed",
				icon: <IconX size={16} stroke={1.5} />,
				autoClose: 5000,
				title: "Request Failed",
				message: (error as Error).message,
				variant: "failed",
			});
		} finally {
			setRequested(false);
		}
	};

	return (
		<Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))} noValidate>
			<Stack gap={"xl"}>
				<Grid>
					<GridCol span={{ base: 12 }}>
						<Center>
							<PinInput
								oneTimeCode
								inputType="number"
								inputMode="numeric"
								aria-label="One time code"
								{...form.getInputProps("otp")}
							/>
						</Center>
					</GridCol>
					<GridCol span={{ base: 12 }}>
						<Grid mt={"md"}>
							<GridCol span={{ base: 12, xs: 6 }}>
								<Center>
									<Button
										w={{ base: "75%" }}
										color="pri.8"
										loading={requested}
										variant="outline"
										onClick={() => handleRequest()}
									>
										{requested ? "Requesting" : "Request Another"}
									</Button>
								</Center>
							</GridCol>
							<GridCol span={{ base: 12, xs: 6 }}>
								<Center>
									<Button w={{ base: "75%" }} type="submit" color="pri.8" loading={sending}>
										{sending ? "Verifying" : "Verify"}
									</Button>
								</Center>
							</GridCol>
						</Grid>
					</GridCol>
				</Grid>
				{time && (
					<Stack ta={"center"} fz={{ base: "xs", xs: "sm" }}>
						<Text c={"dimmed"} inherit>
							If the email you provided is valid, you should have received it. You can otherwise request
							another code in{" "}
							<Text component="span" inherit c={"pri"} fw={500}>
								{time.minutes} minutes
							</Text>
							.
						</Text>
					</Stack>
				)}
			</Stack>
		</Box>
	);
}
