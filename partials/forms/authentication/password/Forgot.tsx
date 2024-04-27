"use client";

import React, { useState } from "react";

import { Box, Button, Center, Grid, GridCol, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import handler from "@/handlers";
import hook from "@/hooks";

import { typeForgot, typeRemaining } from "@/types/form";

export default function Forgot() {
	const [sending, setSending] = useState(false);

	const [time, setTime] = useState<typeRemaining>();

	const form = useForm({
		initialValues: {
			email: "",
		},

		validate: {
			email: value => handler.validator.form.special.email(value),
		},
	});

	const parse = (rawData: typeForgot) => {
		return { email: rawData.email };
	};

	const handleSubmit = async (formValues: typeForgot) => {
		try {
			if (form.isValid()) {
				setSending(true);

				await hook.request
					.post("http://localhost:3000/api/password/forgot", {
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
								id: "otl-send-failed-no-response",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Server Unavailable",
								message: `There was no response from the server.`,
								variant: "failed",
							});
						} else {
							if (!response.user) {
								notifications.show({
									id: "otl-send-failed-account-invalid",
									icon: <IconX size={16} stroke={1.5} />,
									autoClose: 5000,
									title: "Invalid Email",
									message: `No account with the provided email has been found.`,
									variant: "failed",
								});
							} else {
								if (!response.user.otl) {
									notifications.show({
										id: "otl-send-success",
										withCloseButton: false,
										icon: <IconCheck size={16} stroke={1.5} />,
										autoClose: 5000,
										title: "One-time Link Sent",
										message: `A reset link has been sent to the provided email.`,
										variant: "succes",
									});
								} else {
									if (!response.user.otl.expired) {
										notifications.show({
											id: "otl-resend-failed-not-expired",
											icon: <IconX size={16} stroke={1.5} />,
											autoClose: 5000,
											title: "Link Already Sent",
											message: `Remember to check your spam/junk folder(s).`,
											variant: "failed",
										});

										setTime(response.user.otl.time);
									} else {
										notifications.show({
											id: "otl-resend-success",
											withCloseButton: false,
											icon: <IconCheck size={16} stroke={1.5} />,
											autoClose: 5000,
											title: "New One-time Link Sent",
											message: `A new reset link has been sent to the provided email.`,
											variant: "failed",
										});
									}
								}
							}

							form.reset();
						}
					});
			}
		} catch (error) {
			notifications.show({
				id: "otl-send-failed",
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
		<Stack gap={"xl"}>
			<Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))} noValidate>
				<Grid>
					<GridCol span={{ base: 12 }}>
						<TextInput
							required
							label={"Email"}
							type="email"
							description="The email you signed up with"
							placeholder="Your Email"
							{...form.getInputProps("email")}
						/>
					</GridCol>
					<GridCol span={{ base: 12 }}>
						<Center mt={"md"}>
							<Button type="submit" color="pri.8" w={{ base: "75%", sm: "50%" }} loading={sending}>
								{sending ? "Sending" : "Send"}
							</Button>
						</Center>
					</GridCol>
				</Grid>
			</Box>
			<Stack display={time ? "inherit" : "none"} c={"dimmed"} ta={"center"} fz={{ base: "xs", xs: "sm" }}>
				<Text inherit>
					The last link that was sent to the provided email hasn't expired yet. To limit the number of times a
					user can change their password within a given time frame, a user can't request another link until
					the existing link expires.
				</Text>
				<Text inherit>
					Current link expires in{" "}
					<Text component="span" inherit c={"pri"} fw={500}>
						{`${time && time.minutes} minutes`}
					</Text>
					. Remember to check your spam/junk folder.
				</Text>
			</Stack>
		</Stack>
	);
}
