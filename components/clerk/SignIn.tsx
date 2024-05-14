import React from "react";

import { SignIn as ClerkSignIn } from "@clerk/nextjs";

import classes from "./SignUp.module.scss";

export default function SignIn() {
	return <ClerkSignIn appearance={{ elements: {} }} />;
}
