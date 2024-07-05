"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import {
	ActionIcon,
	Anchor,
	Box,
	Button,
	Divider,
	Grid,
	GridCol,
	Group,
	NumberInput,
	PasswordInput,
	Stack,
	Text,
	TextInput,
	Title,
	Transition,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { notifications } from "@mantine/notifications";
import {
	IconBrandAppleFilled,
	IconBrandFacebookFilled,
	IconBrandGoogleFilled,
	IconCheck,
	IconX,
} from "@tabler/icons-react";

import LayoutSection from "@/layouts/Section";

import email from "@/handlers/validators/form/special/email";
import password from "@/handlers/validators/form/special/password";

import { typeSignUp } from "@/types/form";
import request from "@/hooks/request";
import compare from "@/handlers/validators/form/special/compare";
import Link from "next/link";
import converter from "@/utilities/converter";

export default function SignUp() {
	const [submitted, setSubmitted] = useState(false);

	const [verify, setverify] = useState(false);

	const router = useRouter();

	const form = useForm({
		initialValues: {
			email: "",
			password: "",
			passwordConfirm: "",
		},

		validate: {
			email: value => email(value.trim()),
			password: value => password(value.trim(), 8, 24),
			passwordConfirm: (value, values) => compare.string(values.password, value, "Password"),
		},
	});

	const parse = (rawData: typeSignUp) => {
		return {
			email: rawData.email.trim().toLowerCase(),
			password: rawData.password.trim(),
		};
	};

	const handleSignUp = async (formValues: typeSignUp) => {
		if (form.isValid()) {
			try {
				setSubmitted(true);

				// test request body
				// console.log(parse(formValues));

				request
					.post(process.env.NEXT_PUBLIC_API_URL + "/api/auth/sign-up", {
						method: "POST",
						body: JSON.stringify(parse(formValues)),
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json",
						},
					})
					.then(res => {
						if (!res) {
							notifications.show({
								id: "sign-up-failed-no-response",
								icon: <IconX size={16} stroke={1.5} />,
								title: "Server Unavailable",
								message: `There was no response from the server.`,
								variant: "failed",
							});
						} else {
							if (res.user.exists == false) {
								notifications.show({
									id: "sign-up-success",
									icon: <IconCheck size={16} stroke={1.5} />,
									title: "Signed Up",
									message: "Your account has been created",
									variant: "success",
								});

								// switch to verification
								switchContext();
							} else {
								notifications.show({
									id: "sign-up-failed-exists",
									icon: <IconX size={16} stroke={1.5} />,
									title: "Account Exists",
									message: "An account with that email already exists",
									variant: "failed",
								});

								// redirect to sign-in
								router.push("/auth/sign-in");
							}
						}
					});
			} catch (error) {
				notifications.show({
					id: "sign-up-failed",
					icon: <IconX size={16} stroke={1.5} />,
					title: "Sign Up Failed",
					message: (error as Error).message,
					variant: "failed",
				});
			} finally {
				// form.reset();
				setSubmitted(false);
			}
		}
	};

	// form 2 logic

	const [requested, setRequested] = useState(false);
	const [sending, setSending] = useState(false);
	const [time, setTime] = useState<{
		minutes: number;
		seconds: string;
	}>();

	const form2 = useForm({
		initialValues: {
			otp: "",
		},

		validate: {
			otp: value => (value.length < 1 ? "A code is required" : value.length == 6 ? null : "Invalid code"),
		},
	});

	const parse2 = (rawData: any) => {
		return { otp: rawData.otp, email: form.values.email };
	};

	const handleVerify = async (formValues: any) => {
		try {
			if (form2.isValid()) {
				setSending(true);

				await request
					.post(process.env.NEXT_PUBLIC_API_URL + `/api/auth/verify`, {
						method: "POST",
						body: JSON.stringify(parse2(formValues)),
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json",
						},
					})
					.then(res => {
						if (!res) {
							notifications.show({
								id: "otp-verify-failed-no-response",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Server Unavailable",
								message: `There was no response from the server.`,
								variant: "failed",
							});
						} else {
							if (!res.user) {
								notifications.show({
									id: "otp-verify-failed-invalid",
									icon: <IconX size={16} stroke={1.5} />,
									autoClose: 5000,
									title: "Unauthorized",
									message: `You are not allowed to perform this action.`,
									variant: "failed",
								});

								router.replace("/auth/sign-up");
							} else {
								if (!res.user.verified) {
									if (!res.user.otp) {
										notifications.show({
											id: "otp-verify-failed-expired",
											icon: <IconX size={16} stroke={1.5} />,
											autoClose: 5000,
											title: "OTP Expired",
											message: `Request another in the link provided on this page`,
											variant: "failed",
										});

										form2.reset();
									} else {
										if (!res.user.otp.match) {
											notifications.show({
												id: "otp-verify-failed-mismatch",
												icon: <IconX size={16} stroke={1.5} />,
												autoClose: 5000,
												title: "Wrong OTP",
												message: `You have entered the wrong OTP for this email.`,
												variant: "failed",
											});

											form2.reset();
										} else {
											if (!res.user.otp.expired) {
												notifications.show({
													id: "otp-verify-success",
													icon: <IconCheck size={16} stroke={1.5} />,
													autoClose: 5000,
													title: "Email Verified",
													message: `You can now log in to your account.`,
													variant: "success",
												});

												router.replace(`/api/auth/signin`);
											} else {
												notifications.show({
													id: "otp-verify-failed-expired",
													icon: <IconX size={16} stroke={1.5} />,
													autoClose: 5000,
													title: "OTP Expired",
													message: `Request another in the link provided on this page`,
													variant: "failed",
												});

												form2.reset();
											}
										}
									}
								} else {
									notifications.show({
										id: "otp-verify-success",
										icon: <IconCheck size={16} stroke={1.5} />,
										autoClose: 5000,
										title: "Verified",
										message: `The email has already been verified`,
										variant: "success",
									});

									router.replace(`/api/auth/login`);
								}
							}
						}
					});
			}
		} catch (error) {
			console.error("Error:", (error as Error).message);

			notifications.show({
				id: "otp-verify-failed",
				icon: <IconX size={16} stroke={1.5} />,
				autoClose: 5000,
				title: `Verification Failed`,
				message: (error as Error).message,
				variant: "failed",
			});
		} finally {
			setSending(false);
		}
	};

	const handleRequest = async () => {
		try {
			setRequested(true);

			await request
				.post(process.env.NEXT_PUBLIC_API_URL + `/api/auth/verify/resend`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				})
				.then(res => {
					if (!res) {
						notifications.show({
							id: "otp-request-failed-no-response",
							icon: <IconX size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "Server Unavailable",
							message: `There was no response from the server.`,
							variant: "failed",
						});
					} else {
						if (!res.user) {
							notifications.show({
								id: "otp-request-failed-not-found",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Unauthorized",
								message: `You are not allowed to perform this action.`,
								variant: "failed",
							});

							router.replace(`/auth/sign-up`);
						} else {
							if (!res.user.verified) {
								if (!res.user.otp) {
									notifications.show({
										id: "otp-request-success-new-otp-created",
										icon: <IconCheck size={16} stroke={1.5} />,
										autoClose: 5000,
										title: "New OTP Sent",
										message: `A new code has been sent to the provided email.`,
										variant: "success",
									});
								} else {
									if (!res.user.otp.expired) {
										notifications.show({
											id: "otp-request-failed-not-expired",
											icon: <IconX size={16} stroke={1.5} />,
											autoClose: 5000,
											title: "Already Sent",
											message: `Remember to check the spam/junk folder(s).`,
											variant: "failed",
										});

										setTime(converter.millSec(parseInt(res.user.otp.expires) - Date.now()));
									} else {
										notifications.show({
											id: "otp-request-success",
											icon: <IconCheck size={16} stroke={1.5} />,
											autoClose: 5000,
											title: "New OTP Sent",
											message: `A new code has been sent to the provided email.`,
											variant: "success",
										});
									}
								}
							} else {
								notifications.show({
									id: "otp-request-info-already-verified",
									icon: <IconCheck size={16} stroke={1.5} />,
									autoClose: 5000,
									title: "Verified",
									message: `The email has already been verified`,
									variant: "success",
								});

								router.replace(`/api/auth/singin`);
							}
						}
					}
				});
		} catch (error) {
			notifications.show({
				id: "otp-request-failed",
				icon: <IconX size={16} stroke={1.5} />,
				autoClose: 5000,
				title: "Request Failed",
				message: (error as Error).message,
				variant: "failed",
			});
		} finally {
			setRequested(false);
		}
	};

	// end of form 2 logic

	const switchContext = async () => {
		form2.reset();
		setverify(!verify);
	};

	return (
		<>
			<Transition mounted={!verify} transition="fade" duration={0}>
				{styles => (
					<div style={styles}>
						<LayoutSection padded containerized={"xs"}>
							<Stack gap={40} px={{ md: 40 }}>
								<Stack gap={"xs"}>
									<Title order={2} ta={{ base: "center", md: "start" }}>
										Create Your Account
									</Title>
									<Text ta={{ base: "center", md: "start" }}>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vulputate ut laoreet
										velit ma.
									</Text>
								</Stack>

								<Box
									component="form"
									onSubmit={form.onSubmit(values => handleSignUp(values))}
									noValidate
								>
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
												<PasswordInput
													required
													label={"Password"}
													placeholder="Your password"
													{...form.getInputProps("password")}
												/>
											</GridCol>
											<GridCol span={{ base: 12, xs: 12 }}>
												<PasswordInput
													required
													label={"Confirm Password"}
													placeholder="Confirm your password"
													{...form.getInputProps("passwordConfirm")}
												/>
											</GridCol>
											<GridCol span={12} mt={"md"}>
												<Button fullWidth type="submit" loading={submitted}>
													{submitted ? "Signing Up" : "Sign Up"}
												</Button>
											</GridCol>
										</Grid>

										<Divider label="or continue with" />

										<Group justify="center">
											<ActionIcon size={40} radius={"xl"} variant="light">
												<IconBrandGoogleFilled size={20} />
											</ActionIcon>
											<ActionIcon size={40} radius={"xl"} variant="light">
												<IconBrandAppleFilled size={20} />
											</ActionIcon>
											<ActionIcon size={40} radius={"xl"} variant="light">
												<IconBrandFacebookFilled size={20} />
											</ActionIcon>
										</Group>

										<Text fz={{ base: "xs", lg: "sm" }} ta={"center"}>
											Already have an account?{" "}
											<Anchor
												inherit
												fw={500}
												component={Link}
												href={"/sign-in"}
												underline="hover"
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
				{styles => (
					<div style={styles}>
						<LayoutSection padded containerized={"xs"}>
							<Stack gap={40} px={{ md: 40 }}>
								<Stack gap={"xs"}>
									<Title order={2} ta={{ base: "center", md: "start" }}>
										Verify Your Account
									</Title>
									<Text ta={{ base: "center", md: "start" }}>
										A one-time code has been sent to the provided email ({form.values.email}). Enter
										the code below to verify.
									</Text>
								</Stack>

								<Box
									component="form"
									onSubmit={form2.onSubmit(values => handleVerify(values))}
									noValidate
								>
									<Stack gap={"xl"}>
										<Grid>
											<GridCol span={{ base: 12 }}>
												<Stack gap={4} align="end">
													<TextInput
														required
														label={`One-time Code`}
														placeholder="Your Code"
														{...form2.getInputProps("otp")}
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
													<GridCol span={{ base: 12, xs: 6 }}>
														<Button
															fullWidth
															loading={requested}
															variant="light"
															onClick={() => handleRequest()}
														>
															{requested ? "Requesting" : "Request Another"}
														</Button>
													</GridCol>
													<GridCol span={{ base: 12, xs: 6 }}>
														<Button fullWidth type="submit" loading={sending}>
															{sending ? "Verifying" : "Verify"}
														</Button>
													</GridCol>
												</Grid>
											</GridCol>
										</Grid>
										{time && (
											<Stack ta={"center"} fz={{ base: "xs", xs: "sm" }}>
												<Text c={"dimmed"} inherit>
													If the email you provided is valid, you should have received it. You
													can otherwise request another code in{" "}
													<Text component="span" inherit c={"pri"} fw={500}>
														{time.minutes} minutes
													</Text>
													.
												</Text>
											</Stack>
										)}
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
