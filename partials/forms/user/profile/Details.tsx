"use client";

import React, { useState } from "react";

import { Box, Button, Grid, GridCol, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import request from "@/hooks/request";

interface typeProfileDetails {
	username: string;
	bio: string;
}

export default function Details() {
	const [submitted, setSubmitted] = useState(false);

	const form = useForm({
		initialValues: {
			username: "",
			bio: "",
		},

		validate: {
			username: value =>
				value.trim().includes(" ") ? "Do not include spaces" : value.trim().length > 24 && "24 character limit",
			bio: value => value.trim().length > 1024 && "1024 character limit",
		},
	});

	const parse = (rawData: typeProfileDetails) => {
		return {
			username: rawData.username.trim(),
			bio: rawData.bio.trim(),
		};
	};

	const handleSubmit = async (formValues: typeProfileDetails) => {
		if (form.isValid()) {
			try {
				if (!form.isDirty()) {
					notifications.show({
						id: "form-contact-failed-no-update",
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Failed",
						message: "No form fields have been updated",
						variant: "failed",
					});
				} else {
					setSubmitted(true);

					await request
						.post(process.env.NEXT_PUBLIC_API_URL + "/api/contact", {
							method: "POST",
							body: JSON.stringify(parse(formValues)),
							headers: {
								"Content-Type": "application/json",
								Accept: "application/json",
							},
						})
						.then(res => {
							console.log(res);
						});
				}
			} catch (error) {
				notifications.show({
					id: "form-contact-failed",
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
				<GridCol span={{ base: 12 }}>
					<TextInput label={"Username"} placeholder="Your Username" {...form.getInputProps("username")} />
				</GridCol>
				<GridCol span={{ base: 12 }}>
					<Textarea
						label={"Bio"}
						placeholder="Enter your bio here"
						autosize
						minRows={3}
						maxRows={5}
						{...form.getInputProps("bio")}
					/>
				</GridCol>
				<GridCol span={{ base: 6 }}>
					<Button type="submit" loading={submitted} mt={"md"}>
						{submitted ? "Submitting" : "Submit"}
					</Button>
				</GridCol>
			</Grid>
		</Box>
	);
}
