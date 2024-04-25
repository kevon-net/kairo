"use client";

import React, { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Anchor, Box, Button, Center, Grid, GridCol, PasswordInput, Stack, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import handler from "@/handlers";
import hook from "@/hooks";

import { typeSignIn } from "@/types/form";

export default function SignIn() {
	const [sending, setSending] = useState(false);
	const router = useRouter();

	const form = useForm({
		initialValues: {
			email: "",
			password: "",
		},

		validate: {
			email: value => handler.validator.form.special.email(value),
			password: isNotEmpty("Please fill out this field"),
		},
	});

	const parse = (rawData: typeSignIn) => {
		return { email: rawData.email.trim().toLowerCase(), password: rawData.password };
	};

	const handleSubmit = async (formValues: typeSignIn) => {
		try {
			if (form.isValid()) {
				setSending(true);

				await hook.request
					.post("http://localhost:3000/api/sign-in", {
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
								id: "signin-failed-no-response",
								color: "red",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Server Unavailable",
								message: `There was no response from the server.`,
								variant: "failed",
							});
						} else {
							if (!response.user) {
								notifications.show({
									id: "signin-failed-not-found",
									color: "red",
									icon: <IconX size={16} stroke={1.5} />,
									autoClose: 5000,
									title: `Not Found`,
									message: `No account with that email has been found.`,
									variant: "failed",
								});
							} else {
								if (!response.user.passwordValid) {
									notifications.show({
										id: "signin-failed-invalid-login",
										color: "red",
										icon: <IconX size={16} stroke={1.5} />,
										autoClose: 5000,
										title: `Invalid Login`,
										message: `Username password mismatch`,
										variant: "failed",
									});
								} else {
									notifications.show({
										id: "signin-success",
										withCloseButton: false,
										color: "pri.6",
										icon: <IconCheck size={16} stroke={1.5} />,
										autoClose: 5000,
										title: "Authenticated",
										message: `User has logged in.`,
										variant: "success",
									});

									router.replace(`/`);
								}
							}

							form.reset();
						}
					});
			}
		} catch (error) {
			notifications.show({
				id: "signin-failed",
				color: "red",
				icon: <IconX size={16} stroke={1.5} />,
				autoClose: 5000,
				title: `Error`,
				message: (error as Error).message,
				variant: "failed",
			});
		} finally {
			setSending(false);
		}
	};

	return (
		<Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))} noValidate>
			<Stack gap={"xl"}>
				<Grid>
					<GridCol span={{ base: 12 }}>
						<TextInput
							required
							label={"Email"}
							type="email"
							description="We will never share your email"
							placeholder="Your Email"
							{...form.getInputProps("email")}
						/>
					</GridCol>
					<GridCol span={{ base: 12 }}>
						<Stack gap={"xs"} align="end">
							<PasswordInput
								w={"100%"}
								required
								label={"Password"}
								type="password"
								placeholder="Your Password"
								{...form.getInputProps("password")}
							/>
							<Anchor
								component={Link}
								href={"/password/forgot"}
								inherit
								fz={{ base: "xs", xs: "sm" }}
								c={"pri.8"}
							>
								Lost your password?
							</Anchor>
						</Stack>
					</GridCol>
					<GridCol span={{ base: 12 }}>
						<Center mt={"md"}>
							<Button
								type="submit"
								w={{ base: "75%", sm: "50%" }}
								miw={"fit-content"}
								color="pri.8"
								loading={sending}
							>
								{sending ? "Signing In" : "Sign In"}
							</Button>
						</Center>
					</GridCol>
				</Grid>
			</Stack>
		</Box>
	);
}
