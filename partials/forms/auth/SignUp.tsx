"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import {
	ActionIcon,
	Anchor,
	Box,
	Button,
	Divider,
	Grid,
	GridCol,
	Group,
	PasswordInput,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { notifications } from "@mantine/notifications";
import {
	IconBrandAppleFilled,
	IconBrandFacebookFilled,
	IconBrandGoogleFilled,
	IconCheck,
	IconX,
} from "@tabler/icons-react";

import email from "@/handlers/validators/form/special/email";
import password from "@/handlers/validators/form/special/password";

import { typeSignUp } from "@/types/form";
import request from "@/hooks/request";
import compare from "@/handlers/validators/form/special/compare";
import Link from "next/link";

export default function SignUp() {
	const [submitted, setSubmitted] = useState(false);
	const router = useRouter();

	const form = useForm({
		initialValues: {
			email: "",
			password: "",
			passwordConfirm: "",
		},

		validate: {
			email: value => email(value.trim()),
			password: value => password(value.trim(), 8, 24),
			passwordConfirm: (value, values) => compare.string(values.password, value, "Password"),
		},
	});

	const parse = (rawData: typeSignUp) => {
		return {
			email: rawData.email.trim().toLowerCase(),
			password: rawData.password.trim(),
		};
	};

	const handleSubmit = async (formValues: typeSignUp) => {
		if (form.isValid()) {
			try {
				setSubmitted(true);

				// test request body
				// console.log(parse(formValues));

				request
					.post(process.env.NEXT_PUBLIC_API_URL + "/api/auth/sign-up", {
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
								id: "sign-up-failed-no-response",
								icon: <IconX size={16} stroke={1.5} />,
								title: "Server Unavailable",
								message: `There was no response from the server.`,
								variant: "failed",
							});
						} else {
							if (res.user.exists == false) {
								notifications.show({
									id: "sign-up-success",
									icon: <IconCheck size={16} stroke={1.5} />,
									title: "Signed Up",
									message: "Your account has been created",
									variant: "success",
								});
							} else {
								notifications.show({
									id: "sign-up-failed-exists",
									icon: <IconX size={16} stroke={1.5} />,
									title: "Account Exists",
									message: "An account with that email already exists",
									variant: "failed",
								});

								// redirect to sign-in
								router.push("/sign-in");
							}
						}
					});
			} catch (error) {
				notifications.show({
					id: "sign-up-failed",
					icon: <IconX size={16} stroke={1.5} />,
					title: "Sign Up Failed",
					message: (error as Error).message,
					variant: "failed",
				});
			} finally {
				// form.reset();
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
						<PasswordInput
							required
							label={"Password"}
							placeholder="Your password"
							{...form.getInputProps("password")}
						/>
					</GridCol>
					<GridCol span={{ base: 12, xs: 12 }}>
						<PasswordInput
							required
							label={"Confirm Password"}
							placeholder="Confirm your password"
							{...form.getInputProps("passwordConfirm")}
						/>
					</GridCol>
					<GridCol span={12} mt={"md"}>
						<Button fullWidth type="submit" loading={submitted}>
							{submitted ? "Signing Up" : "Sign Up"}
						</Button>
					</GridCol>
				</Grid>

				<Divider label="or continue with" />

				<Group justify="center">
					<ActionIcon size={40} radius={"xl"} variant="light">
						<IconBrandGoogleFilled size={20} />
					</ActionIcon>
					<ActionIcon size={40} radius={"xl"} variant="light">
						<IconBrandAppleFilled size={20} />
					</ActionIcon>
					<ActionIcon size={40} radius={"xl"} variant="light">
						<IconBrandFacebookFilled size={20} />
					</ActionIcon>
				</Group>

				<Text fz={{ base: "xs", lg: "sm" }} ta={"center"}>
					Already have an account?{" "}
					<Anchor inherit fw={500} component={Link} href={"/sign-in"} underline="hover">
						Sign In
					</Anchor>
				</Text>
			</Stack>
		</Box>
	);
}
