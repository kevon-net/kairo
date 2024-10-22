"use client";

import React from "react";

import { Box, Button, Group, PasswordInput, Stack } from "@mantine/core";
import { useFormUserAccountDelete } from "@/hooks/form/user/account/delete";

export default function Delete() {
	const { form, submitted, handleSubmit } = useFormUserAccountDelete();

	return (
		<Box component="form" onSubmit={form.onSubmit(handleSubmit)} noValidate>
			<Stack>
				<PasswordInput
					required
					label={"Password"}
					placeholder="Your Password"
					description="Leave empty if you didn't set password (i.e. signed in with OAuth such as Google)"
					{...form.getInputProps("password")}
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
