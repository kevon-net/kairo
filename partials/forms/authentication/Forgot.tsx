"use client";

import React, { useState } from "react";

import { Box, Button, Center, Grid, Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import utility from "@/utilities";

import api from "@/apis";

import notificationSuccess from "@/styles/notifications/success.module.scss";
import notificationFailure from "@/styles/notifications/failure.module.scss";

import Component from "@/components";

import { typeForgot, typeRemaining } from "@/types/form";

export default function Forgot() {
	const [sending, setSending] = useState(false);

	const [time, setTime] = useState<typeRemaining>();

	const form = useForm({
		initialValues: {
			email: "",
		},

		validate: {
			email: value => utility.validator.form.special.email(value),
		},
	});

	const parse = (rawData: typeForgot) => {
		return { email: rawData.email };
	};

	const handleSubmit = async (formValues: typeForgot) => {
		if (form.isValid()) {
			setSending(true);

			await api.user.authentication
				.passwordForgot(parse(formValues))
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
								id: "account-invalid",
								color: "red",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Invalid Email",
								message: `No account with the provided email has been found.`,
								classNames: {
									root: notificationFailure.root,
									icon: notificationFailure.icon,
									description: notificationFailure.description,
									title: notificationFailure.title,
								},
							});
						} else {
							if (response.otlRecord.exists == false) {
								notifications.show({
									id: "otl-sent",
									withCloseButton: false,
									color: "pri.6",
									icon: <IconCheck size={16} stroke={1.5} />,
									autoClose: 5000,
									title: "One-time Link Sent",
									message: `A reset link has been sent to the provided email.`,
									classNames: {
										root: notificationSuccess.root,
										icon: notificationSuccess.icon,
										description: notificationSuccess.description,
										title: notificationSuccess.title,
									},
								});
							} else {
								if (response.expired == true) {
									notifications.show({
										id: "otl-resent",
										withCloseButton: false,
										color: "pri.6",
										icon: <IconCheck size={16} stroke={1.5} />,
										autoClose: 5000,
										title: "New One-time Link Sent",
										message: `A new reset link has been sent to the provided email.`,
										classNames: {
											root: notificationSuccess.root,
											icon: notificationSuccess.icon,
											description: notificationSuccess.description,
											title: notificationSuccess.title,
										},
									});
								} else {
									notifications.show({
										id: "otl-not-expired",
										color: "red",
										icon: <IconX size={16} stroke={1.5} />,
										autoClose: 5000,
										title: "Link Already Sent",
										message: `Remember to check your spam/junk folder(s).`,
										classNames: {
											root: notificationFailure.root,
											icon: notificationFailure.icon,
											description: notificationFailure.description,
											title: notificationFailure.title,
										},
									});

									setTime(response.time);
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

	return (
		<Stack gap={"xl"}>
			<Stack gap={"xs"}>
				<Title order={1} ta={"center"}>
					Password Reset
				</Title>
				<Text ta={"center"}>
					Enter the email you used to create your account and we'll send you a link to reset your password.
				</Text>
			</Stack>
			<Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))} noValidate w={"100%"}>
				<Grid pb={"md"}>
					<Grid.Col span={{ base: 12 }}>
						<Component.Input.Text
							required
							label={"Email"}
							type="email"
							description="The email you registered up with"
							placeholder="Your Email"
							{...form.getInputProps("email")}
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12 }}>
						<Center py={"md"}>
							<Button type="submit" color="pri.8" w={{ base: "100%", sm: "50%" }} loading={sending}>
								{sending ? "Sending" : "Send"}
							</Button>
						</Center>
					</Grid.Col>
				</Grid>
			</Box>
			<Stack display={time ? "block" : "none"}>
				<Text c={"dimmed"} inherit ta={"center"} fz={"sm"}>
					The last link that was sent to the provided email hasn't expired yet. To limit the number of times a
					user can change their password, you can't request another link until the existing one expires (in{" "}
					<Text component="span" inherit c={"pri"} fw={500}>
						{`${time && time.minutes} minutes`}
					</Text>
					).
				</Text>
			</Stack>
		</Stack>
	);
}
