"use client";

import React from "react";

import { Box, Button, Group, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useFormUserAccountDelete } from "@/hooks/form/account/delete";

export default function Delete() {
	const { form, submitted, handleSubmit } = useFormUserAccountDelete();

	return (
		<Box component="form" onSubmit={form.onSubmit(handleSubmit)} noValidate>
			<Stack>
				<PasswordInput
					label={"Password"}
					placeholder="********"
					description="Leave empty if you used password-less sign in (eg. Google)"
					{...form.getInputProps("password")}
				/>

				<TextInput
					required
					label={"Confirmation"}
					placeholder="DELETE"
					description="Enter 'DELETE' to confirm deletion"
					{...form.getInputProps("confirmation")}
				/>

				<Group justify="end">
					<Button type="submit" color="red" variant="light" loading={submitted}>
						{submitted ? "Deleting Account" : "Delete Account"}
					</Button>
				</Group>
			</Stack>
		</Box>
	);
}
