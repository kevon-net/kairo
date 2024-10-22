"use client";

import React from "react";

import { Box, Button, Grid, GridCol, TextInput } from "@mantine/core";
import { useFormUserProfile } from "@/hooks/form/user/profile";

export default function Profile() {
	const { form, submitted, handleSubmit, session } = useFormUserProfile();

	return (
		<Box component="form" onSubmit={form.onSubmit(handleSubmit)} noValidate>
			<Grid>
				<GridCol span={{ base: 12 }}>
					<TextInput
						required
						label={"Name"}
						placeholder="Your Name"
						{...form.getInputProps("name")}
						disabled={!session}
					/>
				</GridCol>
				<GridCol span={{ base: 12 }}>
					<TextInput
						required
						label={"Email"}
						placeholder="Your Email"
						{...form.getInputProps("email")}
						disabled
						description="You cannot change your email address"
					/>
				</GridCol>
				<GridCol span={{ base: 12 }}>
					<TextInput label={"Phone"} placeholder="Your Phone" {...form.getInputProps("phone")} />
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
