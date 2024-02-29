"use client";

import React, { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Anchor, Box, Button, Center, Grid, Stack, Text, TextInput, Title } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

// icons
import { IconCheck, IconX } from "@tabler/icons-react";

import utility from "@/utilities";

import api from "@/apis";

import notificationSuccess from "@/styles/notifications/success.module.scss";
import notificationFailure from "@/styles/notifications/failure.module.scss";

import { typeSignIn } from "@/types/form";
import Component from "@/components";

export default function SignIn() {
	const [sending, setSending] = useState(false);
	const router = useRouter();

	const form = useForm({
		initialValues: {
			email: "",
			password: "",
		},

		validate: {
			email: value => utility.validator.form.special.email(value),
			password: isNotEmpty("Please fill out this field"),
		},
	});

	const parse = (rawData: typeSignIn) => {
		return { email: rawData.email.trim().toLowerCase(), password: rawData.password };
	};

	const handleSubmit = async (formValues: typeSignIn) => {
		if (form.isValid()) {
			setSending(true);

			await api.user.authentication
				.signIn(parse(formValues))
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
								id: "not-found",
								color: "red",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: `Not Found`,
								message: `No account with that email has been found.`,
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
									id: "invalid-login",
									color: "red",
									icon: <IconX size={16} stroke={1.5} />,
									autoClose: 5000,
									title: `Invalid Login`,
									message: `Username password mismatch`,
									classNames: {
										root: notificationFailure.root,
										icon: notificationFailure.icon,
										description: notificationFailure.description,
										title: notificationFailure.title,
									},
								});
							} else {
								notifications.show({
									id: "valid-login",
									withCloseButton: false,
									color: "pri.6",
									icon: <IconCheck size={16} stroke={1.5} />,
									autoClose: 5000,
									title: "Authenticated",
									message: `User has logged in.`,
									classNames: {
										root: notificationSuccess.root,
										icon: notificationSuccess.icon,
										description: notificationSuccess.description,
										title: notificationSuccess.title,
									},
								});

								router.replace(`/`);
							}
						}
					}
				})
				.then(() => form.reset())
				.catch(error => {
					notifications.show({
						id: "failed-login",
						color: "red",
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: `Error`,
						message: `${error.message}`,
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
		<Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))} noValidate w={"100%"}>
			<Stack gap={"xl"}>
				<Stack gap={"xs"}>
					<Title order={1} ta={"center"}>
						Log In
					</Title>
					<Text ta={"center"}>Enter your credentials to access your account.</Text>
				</Stack>
				<Grid pb={"md"}>
					<Grid.Col span={{ base: 12 }}>
						<Component.Input.Text
							label={"Email"}
							description="We will never share your email"
							required
							type="email"
							placeholder="Your Email"
							{...form.getInputProps("email")}
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12 }}>
						<Stack gap={"xs"} align="end">
							<Component.Input.Password
								w={"100%"}
								required
								label={"Password"}
								type="password"
								placeholder="Your Password"
								{...form.getInputProps("password")}
							/>
							<Anchor component={Link} inherit href={"/auth/password-reset"} c={"pri.8"}>
								Lost your password?
							</Anchor>
						</Stack>
					</Grid.Col>
					<Grid.Col span={{ base: 12 }}>
						<Center py={"md"}>
							<Button type="submit" w={{ base: "100%", sm: "50%" }} color="pri.8" loading={sending}>
								{sending ? "Loggin In" : "Login"}
							</Button>
						</Center>
					</Grid.Col>
				</Grid>
			</Stack>
		</Box>
	);
}
