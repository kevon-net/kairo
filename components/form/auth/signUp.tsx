"use client";

import React from "react";

import {
	Anchor,
	Box,
	Button,
	Center,
	Divider,
	Grid,
	GridCol,
	PasswordInput,
	Stack,
	Text,
	TextInput
} from "@mantine/core";

import AuthProviders from "@/components/common/buttons/auth-providers";
import PopoverPasswordStrength from "@/components/wrapper/popovers/password-strength";

import { signIn as authSignIn } from "next-auth/react";
import { useFormAuthSignUp } from "@/hooks/form/auth/sign-up";

export default function SignUp() {
	const { form, handleSubmit, submitted } = useFormAuthSignUp();

	return (
		<form onSubmit={form.onSubmit(handleSubmit)} noValidate>
			<Stack gap={"xl"}>
				<AuthProviders />

				<Divider label="or" />

				<Grid>
					<GridCol span={{ base: 12, sm: 6 }}>
						<TextInput
							required
							label="First Name"
							placeholder="First Name"
							{...form.getInputProps("name.first")}
						/>
					</GridCol>

					<GridCol span={{ base: 12, sm: 6 }}>
						<TextInput
							required
							label="Last Name"
							placeholder="Last Name"
							{...form.getInputProps("name.last")}
						/>
					</GridCol>

					<GridCol span={{ base: 12, sm: 12 }}>
						<TextInput
							required
							label="Email"
							placeholder="you@example.com"
							{...form.getInputProps("email")}
						/>
					</GridCol>

					<GridCol span={{ base: 12, xs: 6 }}>
						<PopoverPasswordStrength
							required
							label="Password"
							placeholder="********"
							value={form.values.password.initial}
							{...form.getInputProps("password.initial")}
						/>
					</GridCol>

					<GridCol span={{ base: 12, xs: 6 }}>
						<PasswordInput
							required
							label="Confirm Password"
							placeholder="********"
							{...form.getInputProps("password.confirm")}
						/>
					</GridCol>

					<GridCol span={12}>
						<Center mt={"md"}>
							<Button
								w={{
									base: "100%",
									xs: "50%",
									md: "100%"
								}}
								type="submit"
								loading={submitted}
							>
								{submitted ? "Signing Up" : "Sign Up"}
							</Button>
						</Center>
					</GridCol>
				</Grid>

				<Text fz={{ base: "xs", lg: "sm" }} ta={"center"}>
					Already have an account?{" "}
					<Anchor
						inherit
						fw={500}
						underline="hover"
						onClick={async (e) => {
							e.preventDefault();
							await authSignIn();
						}}
					>
						Sign In
					</Anchor>
				</Text>
			</Stack>
		</form>
	);
}
