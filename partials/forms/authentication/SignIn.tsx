"use client";

import React, { useState } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

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
	TextInput,
	Image,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import handler from "@/handlers";
import Buttons from "@/partials/buttons";

import { typeSignIn } from "@/types/form";

import { signIn as authSignIn } from "next-auth/react";

export default function SignIn({ providers }: { providers: any }) {
	const [sending, setSending] = useState(false);
	const router = useRouter();

	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";

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

				const res = await authSignIn("credentials", {
					email: parse(formValues).email,
					password: parse(formValues).password,
					redirect: false,
					callbackUrl: callbackUrl,
				});

				if (!res) {
					notifications.show({
						id: "signin-failed-no-res",
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Server Unavailable",
						message: `There was no response from the server.`,
						variant: "failed",
					});
				} else {
					if (!res.error) {
						notifications.show({
							id: "signin-success",
							icon: <IconCheck size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "Authenticated",
							message: `You're logged in.`,
							variant: "success",
						});

						router.push(`${res.url ? res.url : "/"}`);
					} else {
						if (res.status == 401) {
							notifications.show({
								id: "signin-failed-error",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: `Unauthorized`,
								message: `Incorrect username or password`,
								variant: "failed",
							});
						} else {
							notifications.show({
								id: "signin-failed-error",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: `Authentication Failed`,
								message: res.error,
								variant: "failed",
							});
						}

						form.reset();
					}
				}
			}
		} catch (error) {
			notifications.show({
				id: "signin-failed",
				icon: <IconX size={16} stroke={1.5} />,
				autoClose: 5000,
				title: `Sign In Failed`,
				message: (error as Error).message,
				variant: "failed",
			});
		} finally {
			form.reset();
			setSending(false);
		}
	};

	return (
		<Grid>
			<GridCol span={{ base: 12 }}>
				<Buttons.Provider providers={providers} callBackUrl={callbackUrl} />
			</GridCol>
			<GridCol span={{ base: 12 }}>
				<Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))} noValidate>
					<Stack gap={"xl"}>
						<Grid>
							<GridCol span={{ base: 12 }}>
								<Divider label={"or"} />
							</GridCol>
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
										href={"/auth/password/forgot"}
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
			</GridCol>
		</Grid>
	);
}
