"use client";

import React, { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
	Anchor,
	Box,
	Button,
	Center,
	Checkbox,
	Divider,
	Grid,
	GridCol,
	PasswordInput,
	Stack,
	Text,
	Image,
	TextInput,
} from "@mantine/core";
import { isNotEmpty, matchesField, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import handler from "@/handlers";
import hook from "@/hooks";
import Buttons from "@/partials/buttons";

import { typeSignUp } from "@/types/form";

import { signIn } from "next-auth/react";

export default function Signup({ providers }: { providers: any }) {
	const [sending, setSending] = useState(false);
	const router = useRouter();

	const form = useForm({
		initialValues: {
			name: "",
			email: "",
			password: "",
			passwordConfirm: "",
			policy: false,
		},

		validate: {
			name: value => handler.validator.form.special.text(value, 2, 23),
			email: value => handler.validator.form.special.email(value),
			password: value => handler.validator.form.special.password(value, 8, 24),
			passwordConfirm: matchesField("password", "Passwords do not match"),
			policy: isNotEmpty("You must accept to proceed"),
		},
	});

	const parse = (rawData: typeSignUp) => {
		return {
			name: handler.parser.string.capitalize.words(rawData.name),
			email: rawData.email.trim().toLowerCase(),
			password: rawData.password,
		};
	};

	const handleSubmit = async (formValues: typeSignUp) => {
		if (form.isValid()) {
			setSending(true);

			await hook.request
				.post("http://localhost:3000/api/auth/sign-up", {
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
							id: "signup-failed-no-response",
							icon: <IconX size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "Server Unavailable",
							message: `There was no response from the server.`,
							variant: "failed",
						});
					} else {
						if (!res.exists) {
							notifications.show({
								id: "signup-success",
								icon: <IconCheck size={16} stroke={1.5} />,
								autoClose: 5000,
								title: `Welcome to Next, ${res.user.name}`,
								message: `A verification code has been sent to your email.`,
								variant: "success",
							});

							router.replace(`/${res.user.id}/auth/verify`);
						} else {
							notifications.show({
								id: "signup-failed-exists",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: `User Exists`,
								message: `An account with the provided email already exists.`,
								variant: "failed",
							});

							// router.push("/auth/sign-in");
							res.user.verified ? signIn() : router.replace(`/${res.user.id}/auth/verify`);
						}
					}
				})
				.catch(error => {
					notifications.show({
						id: "signup-failed",
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: `Signup Failed`,
						message: (error as Error).message,
						variant: "failed",
					});
				})
				.finally(() => {
					// form.reset();
					setSending(false);
				});
		}
	};

	return (
		<Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))} noValidate>
			<Stack gap={"xl"}>
				<Grid>
					<GridCol span={{ base: 12 }}>
						<Buttons.Provider providers={providers} />
					</GridCol>
					<GridCol span={{ base: 12 }}>
						<Divider label={"or"} />
					</GridCol>
					<GridCol span={{ base: 12 }}>
						<TextInput
							required
							label={"Name"}
							placeholder="Your Full Name"
							{...form.getInputProps("name")}
						/>
					</GridCol>
					<GridCol span={{ base: 12 }}>
						<TextInput
							required
							label={"Email"}
							description="We will never share your email"
							placeholder="Your Email"
							{...form.getInputProps("email")}
						/>
					</GridCol>
					<GridCol span={{ base: 12, sm: 6 }}>
						<PasswordInput
							required
							label={"Password"}
							placeholder="Your Password"
							{...form.getInputProps("password")}
						/>
					</GridCol>
					<GridCol span={{ base: 12, sm: 6 }}>
						<PasswordInput
							required
							label={"Confirm Password"}
							placeholder="Confirm Your Password"
							{...form.getInputProps("passwordConfirm")}
						/>
					</GridCol>
					<GridCol span={{ base: 12, sm: 12 }}>
						<Checkbox
							size="xs"
							ml={"lg"}
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
					</GridCol>
					<GridCol span={{ base: 8 }} mx={"auto"}>
						<Center mt={"md"}>
							<Button type="submit" w={{ base: "75%", sm: "50%" }} color="pri.8" loading={sending}>
								{sending ? "Signing Up" : "Sign Up"}
							</Button>
						</Center>
					</GridCol>
				</Grid>
			</Stack>
		</Box>
	);
}
