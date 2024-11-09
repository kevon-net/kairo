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
	TextInput,
} from "@mantine/core";

import AuthProviders from "@/components/common/buttons/auth-providers";

import { useFormAuthSignIn } from "@/hooks/form/auth/sign-in";

export default function SignIn() {
	const { form, submitted, handleSubmit } = useFormAuthSignIn();

	return (
		<form onSubmit={form.onSubmit(handleSubmit)} noValidate>
			<Stack gap={"xl"}>
				<AuthProviders />

				<Divider label="or" />

				<Grid>
					<GridCol span={{ base: 12, sm: 12 }}>
						<TextInput
							required
							label="Email"
							placeholder="you@example.com"
							{...form.getInputProps("email")}
						/>
					</GridCol>

					<GridCol span={{ base: 12, xs: 12 }}>
						<Stack gap={"xs"}>
							<PasswordInput
								required
								label="Password"
								placeholder="********"
								value={form.values.password}
								{...form.getInputProps("password")}
								w={"100%"}
							/>
						</Stack>
					</GridCol>

					<GridCol span={12}>
						<Group justify="space-between">
							<Checkbox
								label="Remember me"
								size="xs"
								key={form.key("remember")}
								{...form.getInputProps("remember", {
									type: "checkbox",
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
					</GridCol>

					<GridCol span={12}>
						<Center mt={"md"}>
							<Button w={{ base: "100%", xs: "50%", md: "100%" }} type="submit" loading={submitted}>
								{submitted ? "Signing In" : "Sign In"}
							</Button>
						</Center>
					</GridCol>
				</Grid>

				<Text fz={{ base: "xs", lg: "sm" }} ta={"center"}>
					Don&apos;t have an account?{" "}
					<Anchor inherit fw={500} component={Link} href={"/auth/sign-up"} underline="hover">
						Sign Up
					</Anchor>
				</Text>
			</Stack>
		</form>
	);
}
