"use client";

import React from "react";

import { Box, Button, Center, Grid, GridCol, Stack, Text, TextInput, Transition } from "@mantine/core";
import { useFormAuthPasswordForgot } from "@/hooks/form/auth/password";

import WrapperTransition from "@/components/wrapper/transition";

export default function Forgot() {
	const { form, handleSubmit, sending, requested, time } = useFormAuthPasswordForgot();

	return (
		<form noValidate onSubmit={form.onSubmit(handleSubmit)}>
			<Stack gap={"xl"}>
				<Grid>
					<GridCol span={{ base: 12, sm: 12 }}>
						<TextInput required label={"Email"} placeholder="Your Email" {...form.getInputProps("email")} />
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
								{sending ? "Sending Reset Link" : "Send Reset Link"}
							</Button>
						</Center>
					</GridCol>
				</Grid>

				<WrapperTransition mounted={time != undefined} transition="fade">
					<Box style={{ transition: "0.25s all ease" }} opacity={requested ? "0" : "1"}>
						<Stack ta={"center"} fz={{ base: "xs", xs: "sm" }}>
							<Text c={"dimmed"} inherit>
								To prevent our system from abuse, we limit the number of times a user can request a
								password reset link.
							</Text>
							<Text c={"dimmed"} inherit>
								You can request a new link in{" "}
								<Text component="span" inherit c={"pri"} fw={500}>
									{time?.minutes} minutes
								</Text>
								.
							</Text>
						</Stack>
					</Box>
				</WrapperTransition>
			</Stack>
		</form>
	);
}
