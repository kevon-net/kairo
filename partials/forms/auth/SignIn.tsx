"use client";

import React, { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
	Anchor,
	Box,
	Button,
	Center,
	Divider,
	Grid,
	GridCol,
	PasswordInput,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

import PartialOAuth from "@/partials/Oauth";

import email from "@/handlers/validators/form/special/email";

import { signIn as authSignIn } from "next-auth/react";

import { typeSignIn } from "@/types/form";

export default function SignIn() {
	const [submitted, setSubmitted] = useState(false);
	const router = useRouter();

	const form = useForm({
		initialValues: {
			email: "",
			password: "",
		},

		validate: {
			email: value => email(value.trim()),
			password: value => (value.trim().length > 0 ? null : "Please fill out this field"),
		},
	});

	const parse = (rawData: typeSignIn) => {
		return {
			email: rawData.email.trim().toLowerCase(),
			password: rawData.password.trim(),
		};
	};

	const handleSubmit = async (formValues: typeSignIn) => {
		if (form.isValid()) {
			try {
				setSubmitted(true);

				// // test request body
				// console.log(parse(formValues));

				const res = await authSignIn("credentials", {
					...parse(formValues),
					redirect: false,
					callbackUrl: "/",
				});

				if (!res) {
					notifications.show({
						id: "otp-verify-failed-no-response",
						icon: <IconX size={16} stroke={1.5} />,
						title: "Server Unreachable",
						message: `Check your network connection.`,
						variant: "failed",
					});
				} else {
					if (!res.url) {
						notifications.show({
							id: "otp-verify-failed-no-response",
							icon: <IconX size={16} stroke={1.5} />,
							title: "Unauthorized",
							message: `Incorrect username/password`,
							variant: "failed",
						});
					} else {
						// apply callbackurl
						router.replace(res.url);
					}
				}
			} catch (error) {
				notifications.show({
					id: "sign-in-failed-unauthorized",
					icon: <IconX size={16} stroke={1.5} />,
					title: "Unauthorized",
					message: (error as Error).message,
					variant: "failed",
				});
			} finally {
				form.reset();
				setSubmitted(false);
			}
		}
	};

	return (
		<Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))} noValidate>
			<Stack gap={40}>
				<Grid>
					<GridCol span={{ base: 12, sm: 12 }}>
						<TextInput required label={"Email"} placeholder="Your Email" {...form.getInputProps("email")} />
					</GridCol>
					<GridCol span={{ base: 12, xs: 12 }}>
						<Stack gap={4} align="end">
							<PasswordInput
								required
								label={"Password"}
								placeholder="Your password"
								{...form.getInputProps("password")}
								w={"100%"}
							/>
							<Anchor
								underline="hover"
								inherit
								fz={"xs"}
								ta={"end"}
								w={"fit-content"}
								component={Link}
								href={"/auth/password/forgot"}
							>
								Forgot password
							</Anchor>
						</Stack>
					</GridCol>
					<GridCol span={12} mt={"md"}>
						<Center>
							<Button w={{ base: "100%", xs: "50%", md: "100%" }} type="submit" loading={submitted}>
								{submitted ? "Signing In" : "Sign In"}
							</Button>
						</Center>
					</GridCol>
				</Grid>

				<Divider label="or continue with" />

				<PartialOAuth />

				<Text fz={{ base: "xs", lg: "sm" }} ta={"center"}>
					Don&apos;t have an account?{" "}
					<Anchor inherit fw={500} component={Link} href={"/auth/sign-up"} underline="hover">
						Sign Up
					</Anchor>
				</Text>
			</Stack>
		</Box>
	);
}
