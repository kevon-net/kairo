"use client";

import React, { useState } from "react";

import { signOut } from "next-auth/react";

import { Box, Button, Grid, GridCol, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import handler from "@/handlers";
import hook from "@/hooks";

import { typeUser } from "@/types/models";

import { useRouter } from "next/navigation";

interface typeAccountDetails {
	name: string;
	email: string;
}

export default function Details({ params, initial }: { params: { userId?: string }; initial?: typeUser }) {
	const [submitted, setSubmitted] = useState(false);

	const router = useRouter();

	const form = useForm({
		initialValues: {
			name: initial ? initial.name : "",
			email: initial ? initial.email : "",
		},

		validate: {
			name: value => handler.validator.form.special.text(value, 2, 255),
			email: value => handler.validator.form.special.email(value),
		},
	});

	const parse = (rawData: typeAccountDetails) => {
		return {
			name: handler.parser.string.capitalize.words(rawData.name),
			email: rawData.email.trim().toLowerCase(),
		};
	};

	const handleSubmit = async (formValues: typeAccountDetails) => {
		if (form.isValid()) {
			try {
				if (!form.isDirty()) {
					notifications.show({
						id: "account-details-update-failed-no-update",
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Unchanged Fields",
						message: "Change at least one form field before submitting",
						variant: "failed",
					});
				} else {
					setSubmitted(true);

					await hook.request
						.post(`http://localhost:3000/api/${params.userId}/settings/account/details`, {
							method: "POST",
							body: JSON.stringify({
								name: parse(formValues).name,
								email: parse(formValues).email,
							}),
							headers: {
								"Content-Type": "application/json",
								Accept: "application/json",
							},
						})
						.then(res => {
							if (!res) {
								notifications.show({
									id: "account-details-update-failed-no-response",
									icon: <IconX size={16} stroke={1.5} />,
									autoClose: 5000,
									title: "Server Unavailable",
									message: `There was no response from the server.`,
									variant: "failed",
								});
							} else {
								if (!res.user) {
									notifications.show({
										id: "password-reset-failed-not-found",
										icon: <IconX size={16} stroke={1.5} />,
										autoClose: 5000,
										title: `Not Found`,
										message: `The account is not valid.`,
										variant: "failed",
									});

									signOut({ redirect: false }).then(() => router.replace("/auth/sign-up"));
								} else {
									notifications.show({
										id: "account-details-update-success",
										icon: <IconCheck size={16} stroke={1.5} />,
										autoClose: 5000,
										title: "Account Updated",
										message: "The updates will be applied the next time you log in",
										variant: "success",
									});
								}
							}
						});
				}
			} catch (error) {
				notifications.show({
					id: "account-details-update-failed",
					icon: <IconX size={16} stroke={1.5} />,
					autoClose: 5000,
					title: "Submisstion Failed",
					message: (error as Error).message,
					variant: "failed",
				});
			} finally {
				setSubmitted(false);
			}
		}
	};

	return (
		<Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))} noValidate>
			<Grid>
				<GridCol span={{ base: 12, sm: 6, md: 12 }}>
					<TextInput
						required
						label={"Name"}
						placeholder="Your Name"
						{...form.getInputProps("name")}
						disabled={!initial}
					/>
				</GridCol>
				<GridCol span={{ base: 12, sm: 6, md: 12 }}>
					<TextInput
						required
						label={"Email"}
						placeholder="Your Email"
						{...form.getInputProps("email")}
						disabled
						description="You cannot change your email address"
					/>
				</GridCol>
				<GridCol span={{ base: 12, sm: 6 }}>
					<Button type="submit" loading={submitted} mt={"md"} disabled={!initial}>
						{submitted ? "Saving" : "Save"}
					</Button>
				</GridCol>
			</Grid>
		</Box>
	);
}
