"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { Box, Button, Grid, GridCol, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import text from "@/handlers/validators/form/special/text";
import email from "@/handlers/validators/form/special/email";
import capitalize from "@/handlers/parsers/string/capitalize";

import request from "@/hooks/request";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";

interface typeAccountDetails {
	name?: string | null;
	email?: string | null;
}

export default function Details({ data }: { data: Session }) {
	const [submitted, setSubmitted] = useState(false);

	const router = useRouter();

	const form = useForm({
		initialValues: {
			name: data.user.name ? data.user.name : "",
			email: data.user.email,
		},

		validate: {
			name: value => (value && value?.trim().length > 0 ? text(value, 2, 255) : "Please fill out this field."),
			email: value => value && email(value),
		},
	});

	const parse = (rawData: typeAccountDetails) => {
		return {
			name: rawData.name && capitalize.words(rawData.name),
			email: rawData.email && rawData.email.trim().toLowerCase(),
		};
	};

	const handleSubmit = async (formValues: typeAccountDetails) => {
		if (form.isValid()) {
			try {
				if (!form.isDirty()) {
					notifications.show({
						id: "account-details-update-failed-no-update",
						icon: <IconX size={16} stroke={1.5} />,
						title: "Unchanged Fields",
						message: "Change at least one form field before submitting",
						variant: "failed",
					});
				} else {
					setSubmitted(true);

					const res = await request.post(
						process.env.NEXT_PUBLIC_API_URL + `/api/${data.userId}/settings/account/details`,
						{
							method: "POST",
							body: JSON.stringify(parse(formValues)),
							headers: {
								"Content-Type": "application/json",
								Accept: "application/json",
							},
						}
					);

					if (!res) {
						notifications.show({
							id: "account-details-update-failed-no-response",
							icon: <IconX size={16} stroke={1.5} />,
							title: "Server Unavailable",
							message: `There was no response from the server.`,
							variant: "failed",
						});
					} else {
						if (!res.user.exists) {
							notifications.show({
								id: "account-details-update-failed-not-found",
								icon: <IconX size={16} stroke={1.5} />,
								title: `Not Found`,
								message: `The account is not valid.`,
								variant: "failed",
							});

							// sign out and redirect to sign in page
							await signOut({ redirect: false, callbackUrl: "/" }).then(() =>
								router.replace("/auth/sign-up")
							);
						} else {
							notifications.show({
								id: "account-details-update-success",
								icon: <IconCheck size={16} stroke={1.5} />,
								title: "Account Updated",
								message: "The changes will be applied on next login",
								variant: "success",
							});

							// // update session on client
							// if (session.data) {
							// 	session.data.user.name = parse(formValues).name;
							// 	session.data.user.email = parse(formValues).email;
							// }

							// router.refresh();
						}
					}
				}
			} catch (error) {
				notifications.show({
					id: "account-details-update-failed",
					icon: <IconX size={16} stroke={1.5} />,
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
		<Box component="form" onSubmit={form.onSubmit(values => values && handleSubmit(values))} noValidate>
			<Grid>
				<GridCol span={{ base: 12, sm: 6, md: 12 }}>
					<TextInput
						required
						label={"Name"}
						placeholder="Your Name"
						{...form.getInputProps("name")}
						disabled={!data}
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
					<Button type="submit" loading={submitted} mt={"md"} disabled={!data}>
						{submitted ? "Saving" : "Save"}
					</Button>
				</GridCol>
			</Grid>
		</Box>
	);
}
