"use client";

import React, { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Anchor, Box, Button, Center, Checkbox, Grid, Stack, Text, TextInput, Title } from "@mantine/core";
import { isNotEmpty, matchesField, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import utility from "@/utilities";

import api from "@/apis";

import notificationSuccess from "@/styles/notifications/success.module.scss";
import notificationFailure from "@/styles/notifications/failure.module.scss";

import { typeSignUp } from "@/types/form";
import Component from "@/components";

export default function Signup() {
	const [sending, setSending] = useState(false);
	const router = useRouter();

	const form = useForm({
		initialValues: {
			email: "",
			password: "",
			passwordConfirm: "",
			policy: false,
		},

		validate: {
			email: value => utility.validator.form.special.email(value),
			password: value => utility.validator.form.special.password(value, 8, 24),
			passwordConfirm: matchesField("password", "Passwords do not match"),
			policy: isNotEmpty("You must accept to proceed"),
		},
	});

	const parse = (rawData: typeSignUp) => {
		return { email: rawData.email.trim().toLowerCase(), password: rawData.password };
	};

	const handleSubmit = async (formValues: typeSignUp) => {
		if (form.isValid()) {
			setSending(true);

			await api.user.authentication
				.signUp(parse(formValues))
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
								id: "signup-success",
								withCloseButton: false,
								color: "pri.6",
								icon: <IconCheck size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Registered",
								message: "A verification code has been sent to the provided email.",
								classNames: {
									root: notificationSuccess.root,
									icon: notificationSuccess.icon,
									description: notificationSuccess.description,
									title: notificationSuccess.title,
								},
							});

							router.replace(`/auth/verify/${parse(formValues).email}`);
						} else {
							notifications.show({
								id: "signup-exists",
								color: "red",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: `User Exists`,
								message: `An account with the provided email already exists.`,
								classNames: {
									root: notificationFailure.root,
									icon: notificationFailure.icon,
									description: notificationFailure.description,
									title: notificationFailure.title,
								},
							});

							router.push(`/auth/log-in`);
						}
					}
				})
				.then(() => form.reset())
				.catch(error => {
					notifications.show({
						id: "signup-fail",
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
		<Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))} noValidate w={"100%"}>
			<Stack gap={"xl"}>
				<Stack gap={"xs"}>
					<Title order={1} ta={"center"}>
						Sign Up
					</Title>
					<Text ta={"center"}>Enter your details to create an account.</Text>
				</Stack>
				<Grid pb={"md"}>
					<Grid.Col span={{ base: 12 }}>
						<Component.Input.Text
							required
							label={"Email"}
							type="email"
							description="We will never share your email"
							placeholder="Your Email"
							{...form.getInputProps("email")}
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, sm: 6 }}>
						<Component.Input.Password
							required
							label={"Password"}
							type="password"
							placeholder="Your Password"
							{...form.getInputProps("password")}
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, sm: 6 }}>
						<Component.Input.Password
							required
							label={"Confirm Password"}
							type="password"
							placeholder="Confirm Your Password"
							{...form.getInputProps("passwordConfirm")}
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, sm: 12 }}>
						<Checkbox
							size="xs"
							label={
								<Text inherit>
									I have read and accept the{" "}
									<Anchor
										component={Link}
										href={"/terms-and-conditions"}
										inherit
										fw={500}
										c={"pri.8"}
									>
										terms of use
									</Anchor>
									.
								</Text>
							}
							{...form.getInputProps("policy", {
								type: "checkbox",
							})}
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12 }}>
						<Center py={"md"}>
							<Button type="submit" w={{ base: "100%", sm: "50%" }} color="pri.8" loading={sending}>
								{sending ? "Signing Up" : "Signup"}
							</Button>
						</Center>
					</Grid.Col>
				</Grid>
			</Stack>
		</Box>
	);
}
