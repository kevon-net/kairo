"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { Box, Button, Center, Grid, Stack, Text, TextInput, Title } from "@mantine/core";
import { matchesField, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import utility from "@/utilities";

import api from "@/apis";

import notificationSuccess from "@/styles/notifications/success.module.scss";
import notificationFailure from "@/styles/notifications/failure.module.scss";

import { typeReset } from "@/types/form";
import Component from "@/components";

export default function Reset({ params }: { params: { id?: string; token?: string } }) {
	const [sending, setSending] = useState(false);
	const router = useRouter();

	const form = useForm({
		initialValues: {
			password: "",
			passwordConfirm: "",
		},

		validate: {
			password: value => utility.validator.form.special.password(value, 8, 24),
			passwordConfirm: matchesField("password", "Passwords do not match"),
		},
	});

	const parse = (rawData: typeReset) => {
		return { password: rawData.password, id: params.id, token: params.token };
	};

	const handleSubmit = async (formValues: typeReset) => {
		if (form.isValid()) {
			setSending(true);

			await api.user.authentication
				.passwordReset(parse(formValues))
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
								id: "user-not-found",
								color: "red",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: `Not Found`,
								message: `The account is not valid.`,
								classNames: {
									root: notificationFailure.root,
									icon: notificationFailure.icon,
									description: notificationFailure.description,
									title: notificationFailure.title,
								},
							});
						} else {
							if (response.valid == false) {
								notifications.show({
									id: "invalid-token",
									color: "red",
									icon: <IconX size={16} stroke={1.5} />,
									autoClose: 5000,
									title: `Invalid Link`,
									message: `The link is broken, expired or already used.`,
									classNames: {
										root: notificationFailure.root,
										icon: notificationFailure.icon,
										description: notificationFailure.description,
										title: notificationFailure.title,
									},
								});
							} else {
								if (response.different == false) {
									notifications.show({
										id: "same-password",
										color: "red",
										icon: <IconX size={16} stroke={1.5} />,
										autoClose: 5000,
										title: `Change Error`,
										message: `The old and new passwords must be different.`,
										classNames: {
											root: notificationFailure.root,
											icon: notificationFailure.icon,
											description: notificationFailure.description,
											title: notificationFailure.title,
										},
									});
								} else {
									notifications.show({
										id: "password-valid",
										withCloseButton: false,
										color: "pri.6",
										icon: <IconCheck size={16} stroke={1.5} />,
										autoClose: 5000,
										title: "Password Changed",
										message: `You have successfully cahnged your password.`,
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
						Change Password
					</Title>
					<Text ta={"center"}>Enter the new credentials for your account.</Text>
				</Stack>
				<Grid pb={"md"}>
					<Grid.Col span={{ base: 12 }}>
						<Component.Input.Password
							required
							label={"Password"}
							placeholder="Your Password"
							{...form.getInputProps("password")}
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12 }}>
						<Component.Input.Password
							required
							label={"Confirm Password"}
							placeholder="Confirm Your Password"
							{...form.getInputProps("passwordConfirm")}
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12 }}>
						<Center py={"md"}>
							<Button type="submit" w={{ base: "100%", sm: "50%" }} color="pri.8" loading={sending}>
								{sending ? "Updating" : "Update"}
							</Button>
						</Center>
					</Grid.Col>
				</Grid>
			</Stack>
		</Box>
	);
}
