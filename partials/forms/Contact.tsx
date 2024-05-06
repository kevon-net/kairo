"use client";

import React, { useState } from "react";

import { Box, Button, Center, Checkbox, Grid, GridCol, Select, Text, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import handler from "@/handlers";
import hook from "@/hooks";

import { typeContact } from "@/types/form";

export default function Contact() {
	const [submitted, setSubmitted] = useState(false);

	const form = useForm({
		initialValues: {
			name: "",
			email: "",
			phone: "",
			subject: "",
			message: "",
			policy: false,
		},

		validate: {
			name: value => handler.validator.form.special.text(value, 2, 255),
			email: value => handler.validator.form.special.email(value),
			phone: value => handler.validator.form.special.phone(value),
			subject: value => handler.validator.form.special.text(value, 3, 255),
			message: value => handler.validator.form.special.text(value, 3, 2048),
			policy: value => handler.validator.form.generic.isEmpty.checkbox(value),
		},
	});

	const parse = (rawData: typeContact) => {
		return {
			name: handler.parser.string.capitalize.words(rawData.name),
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

				await hook.request
					.post("http://localhost:3000/api/contact", {
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
								id: "form-contact-failed-no-response",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Server Unavailable",
								message: `There was no response from the server.`,
								variant: "failed",
							});
						} else {
							notifications.show({
								id: "form-contact-success",
								icon: <IconCheck size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Form Submitted",
								message: "Someone will get back to you within 24 hours",
								variant: "success",
							});
						}
					});
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
				form.reset();
				setSubmitted(false);
			}
		}
	};

	return (
		<Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))} noValidate>
			<Grid pb={"md"}>
				<GridCol span={{ base: 12, xs: 6 }}>
					<TextInput required label={"Name"} placeholder="Your Name" {...form.getInputProps("name")} />
				</GridCol>
				<GridCol span={{ base: 12, sm: 6 }}>
					<TextInput required label={"Email"} placeholder="Your Email" {...form.getInputProps("email")} />
				</GridCol>
				<GridCol span={{ base: 12, sm: 6 }}>
					<TextInput required label={"Phone"} placeholder="Your Phone" {...form.getInputProps("phone")} />
				</GridCol>
				<GridCol span={12}>
					<Select
						required
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
						{...form.getInputProps("subject")}
					/>
				</GridCol>
				<GridCol span={12}>
					<Textarea
						required
						label={"Message"}
						placeholder="Write your message here..."
						autosize
						minRows={3}
						maxRows={10}
						{...form.getInputProps("message")}
					/>
				</GridCol>
				<GridCol span={{ base: 12, sm: 12 }}>
					<Checkbox
						required
						ml={"lg"}
						size="xs"
						label={<Text inherit>I have read and accept the terms of use.</Text>}
						{...form.getInputProps("policy", { type: "checkbox" })}
					/>
				</GridCol>
				<GridCol span={12}>
					<Grid mt={"md"}>
						<GridCol span={{ base: 6 }}>
							<Center>
								<Button
									fullWidth
									color="sec"
									type="reset"
									onClick={() => form.reset()}
									disabled={submitted}
								>
									Clear
								</Button>
							</Center>
						</GridCol>
						<GridCol span={{ base: 6 }}>
							<Center>
								<Button fullWidth type="submit" loading={submitted}>
									{submitted ? "Submitting" : "Submit"}
								</Button>
							</Center>
						</GridCol>
					</Grid>
				</GridCol>
			</Grid>
		</Box>
	);
}
