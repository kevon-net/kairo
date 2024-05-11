import React from "react";

import { UserButton as UserButtonClerk } from "@clerk/nextjs";

import classes from "./UserButton.module.scss";

export default function UserButton() {
	return <UserButtonClerk />;
}
