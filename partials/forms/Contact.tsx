"use client";

import React, { useState } from "react";
import ReactDOMServer from "react-dom/server";

import Link from "next/link";

import { Anchor, Box, Button, Checkbox, Grid, Input, Select, Text, TextInput, Textarea } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import Component from "@/components";
import api from "@/apis";

import Template from "@/templates";

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
			phone: value => (value && value.trim().length < 18 ? "Invalid Phone Number" : null),
			subject: value => (value.trim().length < 1 ? "Please select a topic" : null),
			message: value => (value.trim().length < 10 ? "Message Too Short" : null),
			policy: isNotEmpty("You must accept to proceed"),
		},
	});

	const handleSubmit = async () => {
		if (form.isValid()) {
			setSubmitted(true);

			const templateParams = {
				fname:
					form.values.fname.trim().toLowerCase().charAt(0).toUpperCase() +
					form.values.fname.trim().slice(1).toLowerCase(),
				lname:
					form.values.lname.trim().toLowerCase().charAt(0).toUpperCase() +
					form.values.lname.trim().slice(1).toLowerCase(),
				email: form.values.email.trim().toLowerCase(),
				phone: form.values.phone,
				subject: form.values.subject == "Other" ? "General" : `${form.values.subject}`,
				message: form.values.message.trim(),
			};

			// console.log(templateParams);

			const mailOptions = {
				from: "kibochi.thuku@gmail.com",
				to: "kibochi.thuku@gmail.com",
				subject: `${templateParams.subject}`,
				text: "This is some text",
				html: ReactDOMServer.renderToString(<Template.Email.Contact formValues={templateParams} />),
			};

			await api
				.contact(templateParams, mailOptions)
				.then(() =>
					notifications.show({
						id: "contact-form-success",
						withCloseButton: false,
						color: "pri.6",
						icon: <IconCheck size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Inquiry Sent",
						message: "Someone will get back to you within 24 hours",
						styles: theme => ({
							icon: {
								color: theme.colors.sec[4],
							},
							closeButton: {
								color: theme.colors.pri[6],
							},
						}),
					})
				)
				.then(() => form.reset())
				.catch(error =>
					notifications.show({
						id: "contact-form-fail",
						color: "red",
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Send Failed",
						message: `Error: ${error.message}`,
						styles: theme => ({
							closeButton: {
								color: theme.colors.red[6],
							},
						}),
					})
				);

			setSubmitted(false);
		}
	};

	return (
		<Box component="form" onSubmit={form.onSubmit(handleSubmit)} noValidate>
			<Grid pb={"md"}>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<Component.Input.Text
						required
						label={"First Name"}
						placeholder="Your Name"
						{...form.getInputProps("fname")}
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<Component.Input.Text
						required
						label={"Last Name"}
						placeholder="Your Name"
						{...form.getInputProps("lname")}
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<Component.Input.Text
						required
						label={"Email"}
						type="email"
						placeholder="Your Email"
						{...form.getInputProps("email")}
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<Component.Input.Text
						required
						label={"Phone"}
						type="tel"
						placeholder="Your Phone"
						{...form.getInputProps("phone")}
					/>
				</Grid.Col>
				<Grid.Col span={12}>
					<Component.Input.Select
						label="Inquiry"
						description="What are you inquiring about?"
						// placeholder="Select an inquiry"
						defaultValue={""}
						data={[
							{ label: "Select an Inquiry", value: "" },
							{
								label: "Course Enrollment",
								value: "Course Enrollment",
							},
							{
								label: "Drone Purchase",
								value: "Drone Purchase",
							},
							{
								label: "Callback Request",
								value: "Callback Request",
							},
							{
								label: "Drone Space Services",
								value: "Drone Space Services",
							},
							{
								label: "Drone Space Training",
								value: "Drone Space Training",
							},
							{ label: "Other", value: "Other" },
						]}
						required
						{...form.getInputProps("subject")}
					/>
				</Grid.Col>
				<Grid.Col span={12}>
					<Component.Input.Textarea
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
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<Button color="sec" type="reset" fullWidth onClick={() => form.reset()} disabled={submitted}>
						Clear
					</Button>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<Button type="submit" fullWidth loading={submitted}>
						{submitted ? "Submitting" : "Submit"}
					</Button>
				</Grid.Col>
			</Grid>
		</Box>
	);
}
