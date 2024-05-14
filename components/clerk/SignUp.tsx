import React from "react";

import { SignUp as ClerkSignUp } from "@clerk/nextjs";

import classes from "./SignUp.module.scss";

export default function SignUp() {
	return <ClerkSignUp appearance={{ elements: {} }} />;
}
