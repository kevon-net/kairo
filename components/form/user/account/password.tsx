"use client";

import React from "react";

import Link from "next/link";

import { Anchor, Box, Button, Grid, GridCol, PasswordInput } from "@mantine/core";
import { useFormUserAccountPassword } from "@/hooks/form/user/account/password";

export default function Password() {
	const { form, sending, handleSubmit } = useFormUserAccountPassword();

	return (
		<Box component="form" onSubmit={form.onSubmit(handleSubmit)} noValidate>
			<Grid>
				<GridCol span={{ base: 12, sm: 6, md: 12 }}>
					<PasswordInput
						required
						label={"Current Password"}
						placeholder="Your Current Password"
						{...form.getInputProps("current")}
						description={
							<>
								If you can&apos;t remember, you can{" "}
								<Anchor underline="always" inherit component={Link} href="/auth/password/forgot">
									reset your password
								</Anchor>
								.
							</>
						}
					/>
				</GridCol>
				<GridCol span={{ base: 12, sm: 6, md: 12 }}>
					<PasswordInput
						required
						label={"New Password"}
						placeholder="Your New Password"
						{...form.getInputProps("password.initial")}
					/>
				</GridCol>
				<GridCol span={{ base: 12, sm: 6, md: 12 }}>
					<PasswordInput
						required
						label={"Confirm New Password"}
						placeholder="Confirm Your New Password"
						{...form.getInputProps("password.confirm")}
					/>
				</GridCol>
				<GridCol span={{ base: 6 }}>
					<Button type="submit" color="pri" loading={sending} mt={"md"}>
						{sending ? "Updating" : "Update"}
					</Button>
				</GridCol>
			</Grid>
		</Box>
	);
}
