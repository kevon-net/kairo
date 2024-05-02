"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { Box, Button, Center, Grid, GridCol, PasswordInput } from "@mantine/core";
import { matchesField, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import handler from "@/handlers";
import hook from "@/hooks";

import { typeReset } from "@/types/form";
import { signIn } from "next-auth/react";

export default function Reset({ params }: { params: { userId?: string; token?: string } }) {
	const [sending, setSending] = useState(false);
	const router = useRouter();

	const form = useForm({
		initialValues: {
			password: "",
			passwordConfirm: "",
		},

		validate: {
			password: value => handler.validator.form.special.password(value, 8, 24),
			passwordConfirm: (value, values) =>
				handler.validator.form.special.compare.string(values.password, values.passwordConfirm, "Password"),
		},
	});

	const parse = (rawData: typeReset) => {
		return { password: rawData.password };
	};

	const handleSubmit = async (formValues: typeReset) => {
		try {
			if (form.isValid()) {
				setSending(true);

				await hook.request
					.post(`http://localhost:3000/api/${params.userId}/auth/password/reset/${params.token}`, {
						method: "POST",
						body: JSON.stringify({
							userId: params.userId,
							token: params.token,
							password: parse(formValues).password,
						}),
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json",
						},
					})
					.then(response => {
						if (!response) {
							notifications.show({
								id: "password-reset-failed-no-response",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Server Unavailable",
								message: `There was no response from the server.`,
								variant: "failed",
							});
						} else {
							if (!response.user) {
								notifications.show({
									id: "password-reset-failed-not-found",
									icon: <IconX size={16} stroke={1.5} />,
									autoClose: 5000,
									title: `Not Found`,
									message: `The account is not valid.`,
									variant: "failed",
								});

								router.replace("/auth/sign-up");
							} else {
								if (!response.otl) {
									notifications.show({
										id: "password-reset-failed-unauthorized",
										icon: <IconX size={16} stroke={1.5} />,
										autoClose: 5000,
										title: `Access Denied`,
										message: `You are not authorized to perform this action.`,
										variant: "failed",
									});

									router.replace("/auth/password/forgot");
								} else {
									if (!response.user.token) {
										notifications.show({
											id: "password-reset-failed-invalid-token",
											icon: <IconX size={16} stroke={1.5} />,
											autoClose: 5000,
											title: `Invalid Link`,
											message: `The link is expired or already used.`,
											variant: "failed",
										});

										router.replace("/auth/password/forgot");
									} else {
										if (!response.user.password.same) {
											notifications.show({
												id: "password-reset-success",
												withCloseButton: false,
												icon: <IconCheck size={16} stroke={1.5} />,
												autoClose: 5000,
												title: "Password Changed",
												message: `You have successfully cahnged your password.`,
												variant: "success",
											});

											// router.replace(`/auth/log-in`);
											signIn();
										} else {
											notifications.show({
												id: "password-reset-failed-same-password",
												icon: <IconX size={16} stroke={1.5} />,
												autoClose: 5000,
												title: `Failed`,
												message: `Cannot be the same as previous password.`,
												variant: "failed",
											});

											form.reset();
										}
									}
								}
							}
						}
					});
			}
		} catch (error) {
			notifications.show({
				id: "password-reset-failed",
				icon: <IconX size={16} stroke={1.5} />,
				autoClose: 5000,
				title: `Send Failed`,
				message: (error as Error).message,
				variant: "failed",
			});
		} finally {
			setSending(false);
		}
	};

	return (
		<Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))} noValidate>
			<Grid>
				<GridCol span={{ base: 12 }}>
					<PasswordInput
						required
						label={"Password"}
						placeholder="Your Password"
						{...form.getInputProps("password")}
					/>
				</GridCol>
				<GridCol span={{ base: 12 }}>
					<PasswordInput
						required
						label={"Confirm Password"}
						placeholder="Confirm Your Password"
						{...form.getInputProps("passwordConfirm")}
					/>
				</GridCol>
				<GridCol span={{ base: 12 }}>
					<Center mt={"md"}>
						<Button type="submit" w={{ base: "75%", sm: "50%" }} color="pri.8" loading={sending}>
							{sending ? "Resetting" : "Reset"}
						</Button>
					</Center>
				</GridCol>
			</Grid>
		</Box>
	);
}
