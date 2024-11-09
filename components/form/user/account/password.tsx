"use client";

import React from "react";

import Link from "next/link";

import { Anchor, Box, Button, Grid, GridCol, PasswordInput, Stack, Switch, Text, Title } from "@mantine/core";

import { useFormUserAccountPassword } from "@/hooks/form/account/password";

import classes from "./notifications.module.scss";
import { useSession } from "next-auth/react";

export default function Password() {
	const { data: session } = useSession();

	const { form, sending, handleSubmit } = useFormUserAccountPassword({ withCredentials: session?.withPassword! });

	const getLabel = ({ title, desc }: { title: string; desc?: string }) => (
		<Stack gap={0}>
			<Title order={4} fz={"md"}>
				{title}
			</Title>
			{desc && <Text fz={"sm"}>{desc}</Text>}
		</Stack>
	);

	return (
		<Box component="form" onSubmit={form.onSubmit(handleSubmit)} noValidate>
			<Grid>
				<GridCol span={{ base: 12 }}>
					<Switch
						classNames={{
							body: classes.body,
							labelWrapper: classes.labelWrapper,
						}}
						labelPosition="left"
						label={getLabel({
							title: "Use Password",
							desc: "Set a permanent password to login to your account.",
						})}
						key={form.key("withPassword")}
						{...form.getInputProps("withPassword")}
						defaultChecked={session?.withPassword}
					/>
				</GridCol>

				{form.values.withPassword && (
					<>
						{session?.withPassword && (
							<GridCol span={{ base: 12, sm: 6, md: 12 }}>
								<PasswordInput
									required
									label={"Current Password"}
									placeholder="Your Current Password"
									{...form.getInputProps("current")}
									description={
										<>
											If you can&apos;t remember, you can{" "}
											<Anchor
												underline="always"
												inherit
												component={Link}
												href="/auth/password/forgot"
											>
												reset your password
											</Anchor>
											.
										</>
									}
								/>
							</GridCol>
						)}

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
					</>
				)}
			</Grid>
		</Box>
	);
}
