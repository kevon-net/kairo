"use client";

import React, { useState } from "react";

import Link from "next/link";

import { Anchor, Box, Button, Center, Checkbox, Grid, Text } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import Component from "@/components";

import controller from "@/controllers";

import notificationSuccess from "@/styles/notifications/success.module.scss";
import notificationFailure from "@/styles/notifications/failure.module.scss";

import { typeContact } from "@/types/form";

export default function Contact() {
	const [submitted, setSubmitted] = useState(false);

	const form = useForm({
		initialValues: {
			fname: "",
			lname: "",
			email: "",
			phone: "",
			subject: "",
			message: "",
			policy: false,
		},

		validate: {
			fname: value => (value.trim().length < 2 ? "At least 2 letters" : null),
			lname: value => (value.trim().length < 2 ? "At least 2 letters" : null),
			email: value => (/^\S+@\S+$/.test(value.trim()) ? null : "Invalid email"),
			phone: value => (value && value.trim().length < 10 ? "Invalid Phone Number" : null),
			subject: value => (value.trim().length < 1 ? "Please select a topic" : null),
			message: value => (value.trim().length < 10 ? "Message Too Short" : null),
			policy: isNotEmpty("You must accept to proceed"),
		},
	});

	const parse = (rawData: typeContact) => {
		return {
			fname:
				rawData.fname.trim().toLowerCase().charAt(0).toUpperCase() +
				rawData.fname.trim().slice(1).toLowerCase(),
			lname:
				rawData.lname.trim().toLowerCase().charAt(0).toUpperCase() +
				rawData.lname.trim().slice(1).toLowerCase(),
			email: rawData.email.trim().toLowerCase(),
			phone: rawData.phone,
			subject: rawData.subject == "Other" ? "General" : `${rawData.subject}`,
			message: rawData.message.trim(),
		};
	};

	const handleSubmit = async (formValues: typeContact) => {
		if (form.isValid()) {
			try {
				setSubmitted(true);

				await controller.request
					.post("http://localhost:3000/api/contact", {
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
								id: "form-contact-failed-no-response",
								color: "red",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Server Unavailable",
								message: `There was no response from the server.`,
								classNames: {
									root: notificationFailure.root,
									icon: notificationFailure.icon,
									description: notificationFailure.description,
									title: notificationFailure.title,
								},
							});
						} else {
							form.reset();

							notifications.show({
								id: "form-contact-success",
								color: "pri.6",
								icon: <IconCheck size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Form Submitted",
								message: "Someone will get back to you within 24 hours",
								classNames: {
									root: notificationSuccess.root,
									icon: notificationSuccess.icon,
									description: notificationSuccess.description,
									title: notificationSuccess.title,
								},
							});
						}
					});
			} catch (error) {
				notifications.show({
					id: "form-contact-failed",
					color: "red",
					icon: <IconX size={16} stroke={1.5} />,
					autoClose: 5000,
					title: "Submisstion Failed",
					message: (error as Error).message,
					styles: theme => ({
						closeButton: {
							color: theme.colors.red[6],
						},
					}),
				});
			} finally {
				setSubmitted(false);
			}
		}
	};

	return (
		<Box component="form" onSubmit={form.onSubmit(handleSubmit)} noValidate>
			<Grid pb={"md"}>
				<Grid.Col span={{ base: 12, xs: 6 }}>
					<Component.Core.Input.Text
						required
						label={"First Name"}
						placeholder="Your Name"
						{...form.getInputProps("fname")}
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, xs: 6 }}>
					<Component.Core.Input.Text
						required
						label={"Last Name"}
						placeholder="Your Name"
						{...form.getInputProps("lname")}
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<Component.Core.Input.Text
						required
						label={"Email"}
						type="email"
						placeholder="Your Email"
						{...form.getInputProps("email")}
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<Component.Core.Input.Text
						required
						label={"Phone"}
						type="tel"
						placeholder="Your Phone"
						{...form.getInputProps("phone")}
					/>
				</Grid.Col>
				<Grid.Col span={12}>
					<Component.Core.Input.Select
						label="Inquiry"
						description="What are you inquiring about?"
						defaultValue={""}
						data={[
							{ label: "Select an Inquiry", value: "" },
							{
								label: "Option 1",
								value: "1",
							},
							{
								label: "Option 2",
								value: "2",
							},
							{
								label: "Option 3",
								value: "3",
							},
							{ label: "Other", value: "Other" },
						]}
						required
						{...form.getInputProps("subject")}
					/>
				</Grid.Col>
				<Grid.Col span={12}>
					<Component.Core.Input.Textarea
						label={"Message"}
						required
						placeholder="Write your message here..."
						autosize
						minRows={3}
						maxRows={10}
						{...form.getInputProps("message")}
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 12 }}>
					<Checkbox
						ml={"lg"}
						size="xs"
						label={
							<Text inherit>
								I have read and accept the{" "}
								<Anchor component={Link} href={"/policy/terms-and-conditions"} inherit fw={500}>
									terms of use
								</Anchor>
								.
							</Text>
						}
						{...form.getInputProps("policy", { type: "checkbox" })}
					/>
				</Grid.Col>
				<Grid.Col span={12}>
					<Grid mt={"md"}>
						<Grid.Col span={{ base: 12, xs: 6 }}>
							<Center>
								<Button
									w={{ base: "75%" }}
									color="sec"
									type="reset"
									onClick={() => form.reset()}
									disabled={submitted}
								>
									Clear
								</Button>
							</Center>
						</Grid.Col>
						<Grid.Col span={{ base: 12, xs: 6 }}>
							<Center>
								<Button w={{ base: "75%" }} type="submit" loading={submitted}>
									{submitted ? "Submitting" : "Submit"}
								</Button>
							</Center>
						</Grid.Col>
					</Grid>
				</Grid.Col>
			</Grid>
		</Box>
	);
}
