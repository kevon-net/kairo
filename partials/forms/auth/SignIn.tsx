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
	IconBrandGoogle,
	IconBrandGoogleFilled,
	IconCheck,
	IconX,
} from "@tabler/icons-react";

import email from "@/handlers/validators/form/special/email";

import { typeSignIn } from "@/types/form";
import request from "@/hooks/request";
import Link from "next/link";

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

				// test request body
				// console.log(parse(formValues));

				request
					.post(process.env.NEXT_PUBLIC_API_URL + "/api/auth/sign-in", {
						method: "POST",
						body: JSON.stringify(parse(formValues)),
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json",
						},
					})
					.then(res => {
						console.log(res);

						// if (!res) {
						// 	notifications.show({
						// 		id: "form-contact-failed-no-response",
						// 		icon: <IconX size={16} stroke={1.5} />,
						// 		autoClose: 5000,
						// 		title: "Server Unavailable",
						// 		message: `There was no response from the server.`,
						// 		variant: "failed",
						// 	});
						// } else {
						// 	notifications.show({
						// 		id: "form-contact-success",
						// 		icon: <IconCheck size={16} stroke={1.5} />,
						// 		autoClose: 5000,
						// 		title: "Form Submitted",
						// 		message: "Someone will get back to you within 24 hours",
						// 		variant: "success",
						// 	});
						// }
					});
			} catch (error) {
				notifications.show({
					id: "form-contact-failed",
					icon: <IconX size={16} stroke={1.5} />,
					autoClose: 5000,
					title: "Sign Up Failed",
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
							<Anchor underline="hover" inherit fz={"xs"} ta={"end"} w={"fit-content"}>
								Forgot password
							</Anchor>
						</Stack>
					</GridCol>
					<GridCol span={12} mt={"md"}>
						<Button fullWidth type="submit" loading={submitted}>
							{submitted ? "Signing In" : "Sign In"}
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
					Don&apos;t have an account?{" "}
					<Anchor inherit fw={500} component={Link} href={"/sign-up"} underline="hover">
						Sign Up
					</Anchor>
				</Text>
			</Stack>
		</Box>
	);
}
