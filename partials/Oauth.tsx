"use client";

import React from "react";

import { ActionIcon, Group } from "@mantine/core";

import { IconBrandAppleFilled, IconBrandFacebookFilled, IconBrandGoogleFilled } from "@tabler/icons-react";

import { signIn } from "next-auth/react";

export default function Oauth() {
	return (
		<Group justify="center">
			<ActionIcon
				size={40}
				radius={"xl"}
				variant="light"
				onClick={async () => await signIn("google", { redirect: false, callbackUrl: "/" })}
			>
				<IconBrandGoogleFilled size={20} />
			</ActionIcon>
			<ActionIcon size={40} radius={"xl"} variant="light">
				<IconBrandAppleFilled size={20} />
			</ActionIcon>
			<ActionIcon size={40} radius={"xl"} variant="light">
				<IconBrandFacebookFilled size={20} />
			</ActionIcon>
		</Group>
	);
}
