"use client";

import React from "react";

import { Button, Center, Grid, GridCol, PasswordInput } from "@mantine/core";

import { Params } from "@/app/(authentication)/auth/(default)/layout";
import { useFormAuthPasswordReset } from "@/hooks/form/auth/password";
import PopoverPasswordStrength from "@/components/wrapper/popovers/password-strength";

export default function Reset({ data }: { data: Params }) {
	const { form, handleSubmit, sending } = useFormAuthPasswordReset(data);

	return (
		<form onSubmit={form.onSubmit(handleSubmit)} noValidate>
			<Grid>
				<GridCol span={{ base: 12, sm: 6, md: 12 }}>
					<PopoverPasswordStrength
						required
						label={"New Password"}
						placeholder="********"
						value={form.values.password}
						{...form.getInputProps("password")}
					/>
				</GridCol>
				<GridCol span={{ base: 12, sm: 6, md: 12 }}>
					<PasswordInput
						required
						label={"Confirm New Password"}
						placeholder="********"
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
		</form>
	);
}
