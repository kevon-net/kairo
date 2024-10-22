"use client";

import React from "react";

import { Box, Button, Center, Grid, GridCol, PasswordInput } from "@mantine/core";

import { typeParams } from "@/app/(authentication)/auth/(default)/layout";
import { useFormAuthPasswordReset } from "@/hooks/form/auth/password";

export default function Reset({ data }: { data: typeParams }) {
	const { form, handleSubmit, sending } = useFormAuthPasswordReset(data);

	return (
		<Box component="form" onSubmit={form.onSubmit(handleSubmit)} noValidate>
			<Grid>
				<GridCol span={{ base: 12, sm: 6, md: 12 }}>
					<PasswordInput
						required
						label={"New Password"}
						placeholder="Your New Password"
						{...form.getInputProps("password")}
					/>
				</GridCol>
				<GridCol span={{ base: 12, sm: 6, md: 12 }}>
					<PasswordInput
						required
						label={"Confirm New Password"}
						placeholder="Confirm Your New Password"
						{...form.getInputProps("passwordConfirm")}
					/>
				</GridCol>
				<GridCol span={{ base: 12 }}>
					<Center>
						<Button
							w={{ base: "100%", xs: "50%", md: "100%" }}
							type="submit"
							color="pri"
							loading={sending}
							mt={"md"}
						>
							{sending ? "Resetting" : "Reset"}
						</Button>
					</Center>
				</GridCol>
			</Grid>
		</Box>
	);
}
