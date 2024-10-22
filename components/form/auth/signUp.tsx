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
	TextInput,
	Title,
	Transition
} from "@mantine/core";

import LayoutSection from "@/components/layout/section";
import AuthProviders from "@/components/common/buttons/auth-providers";
import LayoutHeaderAuth from "@/components/layout/headers/auth";

import { signIn as authSignIn } from "next-auth/react";
import { useFormAuthSignUp } from "@/hooks/form/auth/sign-up";

export default function SignUp({ props }: { props?: { userEmail?: string } }) {
	const {
		formSignUp,
		formVerify,
		handleSubmitSignUp,
		handleSubmitVerify,
		handleRequest,
		submitted,
		verify,
		requested,
		time,
		switchContext
	} = useFormAuthSignUp(props);

	return (
		<>
			<Transition mounted={!verify} transition="fade" duration={0}>
				{(styles) => (
					<div style={styles}>
						<LayoutSection id={"partial-form-auth-signup-create"} padded containerized={"xs"}>
							<Stack gap={40} px={{ md: 40 }}>
								<LayoutHeaderAuth
									data={{
										title: "Create Your Account",
										desc: "Join us and start your journey today."
									}}
								/>

								<Box component="form" onSubmit={formSignUp.onSubmit(handleSubmitSignUp)} noValidate>
									<Stack gap={40}>
										<Grid>
											<GridCol span={{ base: 12, sm: 12 }}>
												<TextInput
													required
													label={"Email"}
													placeholder="Your Email"
													{...formSignUp.getInputProps("email")}
												/>
											</GridCol>
											<GridCol span={{ base: 12, xs: 12 }}>
												<PasswordInput
													required
													label={"Password"}
													placeholder="Your password"
													{...formSignUp.getInputProps("password")}
												/>
											</GridCol>
											<GridCol span={{ base: 12, xs: 12 }}>
												<PasswordInput
													required
													label={"Confirm Password"}
													placeholder="Confirm your password"
													{...formSignUp.getInputProps("passwordConfirm")}
												/>
											</GridCol>
											<GridCol span={12} mt={"lg"}>
												<Center>
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

										<Divider label="or continue with" />

										<AuthProviders />

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
								</Box>
							</Stack>
						</LayoutSection>
					</div>
				)}
			</Transition>

			<Transition mounted={verify} transition="fade" duration={0}>
				{(styles) => (
					<div style={styles}>
						<LayoutSection id={"partial-form-auth-signup-verify"} padded containerized={"xs"}>
							<Stack gap={40} px={{ md: 40 }}>
								<LayoutHeaderAuth
									data={{
										title: "Verify Your Account",
										desc: `A one-time code has been sent to the provided email ${formSignUp.values.email}. Enter
										the code below to verify.`
									}}
								/>

								<Box component="form" onSubmit={formVerify.onSubmit(handleSubmitVerify)} noValidate>
									<Stack gap={"xl"}>
										<Grid>
											<GridCol span={{ base: 12 }}>
												<Stack gap={4} align="end">
													<TextInput
														required
														label={`One-time Code`}
														placeholder="Your Code"
														{...formVerify.getInputProps("otp")}
														w={"100%"}
													/>
													<Anchor
														underline="hover"
														inherit
														fz={"xs"}
														ta={"end"}
														w={"fit-content"}
														onClick={() => switchContext()}
													>
														Change email
													</Anchor>
												</Stack>
											</GridCol>
											<GridCol span={{ base: 12 }}>
												<Grid mt={"md"}>
													<GridCol
														span={{
															base: 12,
															xs: 6
														}}
													>
														<Button
															fullWidth
															loading={requested}
															variant="light"
															onClick={() => handleRequest()}
														>
															{requested ? "Requesting" : "Request Another"}
														</Button>
													</GridCol>
													<GridCol
														span={{
															base: 12,
															xs: 6
														}}
													>
														<Button fullWidth type="submit" loading={submitted}>
															{submitted ? "Verifying" : "Verify"}
														</Button>
													</GridCol>
												</Grid>
											</GridCol>
										</Grid>

										<Transition mounted={time != undefined} transition="fade" duration={0}>
											{(styles) => (
												<Box
													style={{
														...styles,
														transition: "0.25s all ease"
													}}
													opacity={requested ? "0" : "1"}
												>
													<Stack
														ta={"center"}
														fz={{
															base: "xs",
															xs: "sm"
														}}
													>
														<Text c={"dimmed"} inherit>
															If the email you provided is valid, you should have received
															it. Remember to check your spam/junk folder(s).
														</Text>
														<Text c={"dimmed"} inherit>
															You can otherwise request another code in{" "}
															<Text component="span" inherit c={"pri"} fw={500}>
																{time?.minutes} minutes
															</Text>
															.
														</Text>
													</Stack>
												</Box>
											)}
										</Transition>
									</Stack>
								</Box>
							</Stack>
						</LayoutSection>
					</div>
				)}
			</Transition>
		</>
	);
}
