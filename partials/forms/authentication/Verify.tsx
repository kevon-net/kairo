"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Box, Button, Center, Grid, Group, PinInput, Stack, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import notificationSuccess from "@/styles/notifications/success.module.scss";
import notificationFailure from "@/styles/notifications/failure.module.scss";

import api from "@/apis";

import { typeRemaining, typeVerify } from "@/types/form";

export default function Verify({ userEmail }: { userEmail: string }) {
	const [sending, setSending] = useState(false);
	const [requested, setRequested] = useState(false);
	const [time, setTime] = useState<typeRemaining>();

	const router = useRouter();

	const form = useForm({
		initialValues: {
			otp: "",
		},

		validate: {
			otp: value => value.length < 4,
		},
	});

	const parseEmail = userEmail.trim().toLowerCase();

	const parse = (rawData: typeVerify) => {
		return { email: parseEmail, otp: rawData.otp };
	};

	const handleSubmit = async (formValues: typeVerify) => {
		if (form.isValid()) {
			setSending(true);

			await api.user.authentication
				.otpSend(parse(formValues))
				.then(response => {
					if (!response) {
						notifications.show({
							id: "no-response",
							color: "red",
							icon: <IconX size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "Server Unavailable",
							message: `There was no response from the server.`,
							classNames: {
								root: notificationFailure.root,
								icon: notificationFailure.icon,
								description: notificationFailure.description,
								title: notificationFailure.title,
							},
						});
					} else {
						if (response.exists == false) {
							notifications.show({
								id: "otp-invalid",
								color: "red",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Invalid OTP",
								message: `The email doesn't exist or has already been verified`,
								classNames: {
									root: notificationFailure.root,
									icon: notificationFailure.icon,
									description: notificationFailure.description,
									title: notificationFailure.title,
								},
							});
						} else {
							if (response.match == false) {
								notifications.show({
									id: "otp-mismatch",
									color: "red",
									icon: <IconX size={16} stroke={1.5} />,
									autoClose: 5000,
									title: "Wrong OTP",
									message: `You have entered the wrong OTP for this email.`,
									classNames: {
										root: notificationFailure.root,
										icon: notificationFailure.icon,
										description: notificationFailure.description,
										title: notificationFailure.title,
									},
								});
							} else {
								if (response.expired == true) {
									notifications.show({
										id: "otp-expired",
										color: "red",
										icon: <IconX size={16} stroke={1.5} />,
										autoClose: 5000,
										title: "OTP Expired",
										message: `Request another in the link provided on this page`,
										classNames: {
											root: notificationFailure.root,
											icon: notificationFailure.icon,
											description: notificationFailure.description,
											title: notificationFailure.title,
										},
									});
								} else {
									notifications.show({
										id: "otp-match",
										withCloseButton: false,
										color: "pri.6",
										icon: <IconCheck size={16} stroke={1.5} />,
										autoClose: 5000,
										title: "Email Verified",
										message: `You can now log in to your account.`,
										classNames: {
											root: notificationSuccess.root,
											icon: notificationSuccess.icon,
											description: notificationSuccess.description,
											title: notificationSuccess.title,
										},
									});

									router.replace(`/auth/log-in`);
								}
							}
						}
					}
				})
				.then(() => form.reset())
				.catch(error => {
					notifications.show({
						id: "otp-verify-fail",
						color: "red",
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: `Send Failed`,
						message: `Error: ${error.message}`,
						classNames: {
							root: notificationFailure.root,
							icon: notificationFailure.icon,
							description: notificationFailure.description,
							title: notificationFailure.title,
						},
					});
				});

			setSending(false);
		}
	};

	const handleRequest = async () => {
		setRequested(true);

		await api.user.authentication.otpResend(parseEmail).then(response => {
			if (!response) {
				notifications.show({
					id: "no-response",
					color: "red",
					icon: <IconX size={16} stroke={1.5} />,
					autoClose: 5000,
					title: "Server Unavailable",
					message: `There was no response from the server.`,
					classNames: {
						root: notificationFailure.root,
						icon: notificationFailure.icon,
						description: notificationFailure.description,
						title: notificationFailure.title,
					},
				});
			} else {
				if (response.exists == false) {
					notifications.show({
						id: "otp-request-error",
						color: "red",
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Not Found",
						message: `The email doesn't exist or has already been verified`,
						classNames: {
							root: notificationFailure.root,
							icon: notificationFailure.icon,
							description: notificationFailure.description,
							title: notificationFailure.title,
						},
					});
				} else {
					if (response.verified == false) {
						if (response.expired == false) {
							notifications.show({
								id: "otp-not-sent",
								color: "red",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Already Sent",
								message: `Remember to check the spam or junk folder.`,
								classNames: {
									root: notificationFailure.root,
									icon: notificationFailure.icon,
									description: notificationFailure.description,
									title: notificationFailure.title,
								},
							});

							setTime(response.time);
						} else {
							notifications.show({
								id: "otp-resent",
								withCloseButton: false,
								color: "pri.6",
								icon: <IconCheck size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "New OTP Sent",
								message: `A new code has been sent to the provided email.`,
								classNames: {
									root: notificationSuccess.root,
									icon: notificationSuccess.icon,
									description: notificationSuccess.description,
									title: notificationSuccess.title,
								},
							});
						}
					} else {
						notifications.show({
							id: "user-verified",
							withCloseButton: false,
							color: "pri.6",
							icon: <IconCheck size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "User Verified",
							message: `The email has already been verified.`,
							classNames: {
								root: notificationSuccess.root,
								icon: notificationSuccess.icon,
								description: notificationSuccess.description,
								title: notificationSuccess.title,
							},
						});
					}
				}
			}
		});

		setRequested(false);
	};

	return (
		<Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))} noValidate w={"100%"}>
			<Stack gap={"xl"} ta={"center"}>
				<Stack gap={"xs"}>
					<Title order={1} ta={"center"}>
						Verify Email
					</Title>
					<Text inherit>
						A verification code has been sent to{" "}
						<Text component="span" inherit c={"pri"} fw={"500"}>
							{userEmail}
						</Text>
						. Copy the code from the email and paste it here.
					</Text>
				</Stack>
				<Grid pb={"md"}>
					<Grid.Col span={{ base: 12 }}>
						<Center>
							<PinInput
								oneTimeCode
								inputType="number"
								inputMode="numeric"
								aria-label="One time code"
								{...form.getInputProps("otp")}
							/>
						</Center>
					</Grid.Col>
					<Grid.Col span={{ base: 12 }}>
						<Center py={"md"}>
							<Group grow w={"100%"}>
								<Button
									color="pri.8"
									loading={requested}
									variant="outline"
									onClick={() => handleRequest()}
								>
									{requested ? "Requesting" : "Request Another"}
								</Button>
								<Button type="submit" color="pri.8" loading={sending}>
									{sending ? "Verifying" : "Verify"}
								</Button>
							</Group>
						</Center>
					</Grid.Col>
				</Grid>
				{time && (
					<Stack>
						<Text c={"dimmed"} inherit fz={"sm"}>
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
