"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { Box, Button, Center, Flex, Grid, GridCol, Group, PinInput, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import hook from "@/hooks";

import { typeRemaining, typeVerify } from "@/types/form";

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
		return { otp: rawData.otp };
	};

	const handleSubmit = async (formValues: typeVerify) => {
		try {
			if (form.isValid()) {
				setSending(true);

				await hook.request
					.post(`http://localhost:3000/api/${userId}/verify`, {
						method: "POST",
						body: JSON.stringify(parse(formValues)),
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json",
						},
					})
					.then(response => {
						if (!response) {
							notifications.show({
								id: "otp-verify-failed-no-response",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Server Unavailable",
								message: `There was no response from the server.`,
								variant: "failed",
							});
						} else {
							if (!response.otp) {
								notifications.show({
									id: "otp-verify-failed-invalid",
									icon: <IconX size={16} stroke={1.5} />,
									autoClose: 5000,
									title: "Invalid OTP",
									message: `The email doesn't exist or has already been verified`,
									variant: "failed",
								});
							} else {
								if (!response.otp.match) {
									notifications.show({
										id: "otp-verify-failed-mismatch",
										icon: <IconX size={16} stroke={1.5} />,
										autoClose: 5000,
										title: "Wrong OTP",
										message: `You have entered the wrong OTP for this email.`,
										variant: "failed",
									});
								} else {
									if (!response.otp.expired) {
										notifications.show({
											id: "otp-verify-success",
											withCloseButton: false,
											icon: <IconCheck size={16} stroke={1.5} />,
											autoClose: 5000,
											title: "Email Verified",
											message: `You can now log in to your account.`,
											variant: "success",
										});

										router.replace(`/sign-in`);
									} else {
										notifications.show({
											id: "otp-verify-failed-expired",
											icon: <IconX size={16} stroke={1.5} />,
											autoClose: 5000,
											title: "OTP Expired",
											message: `Request another in the link provided on this page`,
											variant: "failed",
										});
									}
								}
							}

							form.reset();
						}
					});
			}
		} catch (error) {
			notifications.show({
				id: "otp-verify-failed",
				icon: <IconX size={16} stroke={1.5} />,
				autoClose: 5000,
				title: `Send Failed`,
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
				.post(`http://localhost:3000/api/${userId}/verify/resend`, {
					method: "POST",
					body: JSON.stringify({ userId }),
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				})
				.then(response => {
					if (!response) {
						notifications.show({
							id: "otp-request-failed-no-response",
							icon: <IconX size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "Server Unavailable",
							message: `There was no response from the server.`,
							variant: "failed",
						});
					} else {
						if (!response.user.userVerified) {
							if (!response.user.otp.expired) {
								notifications.show({
									id: "otp-request-failed-not-expired",
									icon: <IconX size={16} stroke={1.5} />,
									autoClose: 5000,
									title: "Already Sent",
									message: `Remember to check the spam or junk folder.`,
									variant: "failed",
								});

								setTime(response.user.otp.timeToExpiry);
							} else {
								notifications.show({
									id: "otp-request-success",
									withCloseButton: false,
									icon: <IconCheck size={16} stroke={1.5} />,
									autoClose: 5000,
									title: "New OTP Sent",
									message: `A new code has been sent to the provided email.`,
									variant: "success",
								});
							}
						} else {
							notifications.show({
								id: "otp-request-failed-verified-or-not-found",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Not Found",
								message: `The account doesn't exist or has already been verified`,
								variant: "failed",
							});
						}
					}
				});
		} catch (error) {
			notifications.show({
				id: "otp-request-failed",
				icon: <IconX size={16} stroke={1.5} />,
				autoClose: 5000,
				title: "Server Unavailable",
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
								{`${time.minutes} minute(s)`}
							</Text>
							.
						</Text>
					</Stack>
				)}
			</Stack>
		</Box>
	);
}
