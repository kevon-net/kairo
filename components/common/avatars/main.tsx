"use client";

import { useSession } from "@/hooks/session";
import { initialize } from "@/utilities/formatters/string";
import { Avatar, MantineStyleProps } from "@mantine/core";
import React from "react";

export default function Main({ size = { base: 56, md: 120, lg: 56 } }: { size?: MantineStyleProps["w"] }) {
	const { session } = useSession();

	return !session ? (
		<Avatar alt={"avatar"} title={"User Name"} w={size} h={size} />
	) : !session?.user?.image ? (
		<Avatar alt={session.user.name} title={session.user.name} w={size} h={size}>
			{initialize(session.user.name)}
		</Avatar>
	) : (
		<Avatar src={session.user.image} alt={session.user.name} title={session.user.name} w={size} h={size} />
	);
}
