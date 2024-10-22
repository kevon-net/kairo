"use client";

import React from "react";

import Link from "next/link";

import {
	Anchor,
	Box,
	Button,
	Center,
	Checkbox,
	Divider,
	Grid,
	GridCol,
	Group,
	PasswordInput,
	Stack,
	Text,
	TextInput
} from "@mantine/core";

import AuthProviders from "@/components/common/buttons/auth-providers";

import { useFormAuthSignIn } from "@/hooks/form/auth/sign-in";

export default function SignIn() {
	const { form, submitted, handleSubmit } = useFormAuthSignIn();

	return (
		<Box component="form" onSubmit={form.onSubmit(handleSubmit)} noValidate>
			<Stack gap={40}>
				<Grid>
					<GridCol span={{ base: 12, sm: 12 }}>
						<TextInput
							required
							label={"Email"}
							placeholder="Your Email"
							{...form.getInputProps("email")}
						/>
					</GridCol>
					<GridCol span={{ base: 12, xs: 12 }}>
						<Stack gap={"xs"}>
							<PasswordInput
								required
								label={"Password"}
								placeholder="Your password"
								{...form.getInputProps("password")}
								w={"100%"}
							/>

							<Group justify="space-between">
								<Checkbox
									label="Remember me"
									key={form.key("remember")}
									{...form.getInputProps("remember", {
										type: "checkbox"
									})}
								/>

								<Anchor
									underline="hover"
									inherit
									fz={"xs"}
									ta={"end"}
									w={"fit-content"}
									component={Link}
									href={"/auth/password/forgot"}
								>
									Forgot password
								</Anchor>
							</Group>
						</Stack>
					</GridCol>
					<GridCol span={12} mt={"md"}>
						<Center>
							<Button
								w={{ base: "100%", xs: "50%", md: "100%" }}
								type="submit"
								loading={submitted}
							>
								{submitted ? "Signing In" : "Sign In"}
							</Button>
						</Center>
					</GridCol>
				</Grid>

				<Divider label="or continue with" />

				<AuthProviders />

				<Text fz={{ base: "xs", lg: "sm" }} ta={"center"}>
					Don&apos;t have an account?{" "}
					<Anchor
						inherit
						fw={500}
						component={Link}
						href={"/auth/sign-up"}
						underline="hover"
					>
						Sign Up
					</Anchor>
				</Text>
			</Stack>
		</Box>
	);
}
