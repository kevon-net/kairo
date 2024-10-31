import { initialize } from "@/utilities/formatters/string";
import { Avatar, MantineStyleProps } from "@mantine/core";
import { useSession } from "next-auth/react";
import React from "react";

export default function Main({ size = { base: 56, md: 120, lg: 56 } }: { size?: MantineStyleProps["w"] }) {
	const { data: session } = useSession();
	const userName = session?.user?.name;

	const userDesc = userName ? userName : "User";

	return !session ? (
		<Avatar alt={userDesc} title={userDesc} w={size} h={size} />
	) : !session?.user?.image ? (
		<Avatar alt={userDesc} title={userDesc} w={size} h={size}>
			{userName ? initialize(userName) : session?.user.email?.charAt(0).toUpperCase()}
		</Avatar>
	) : (
		<Avatar src={session.user.image} alt={userDesc} title={userDesc} w={size} h={size} />
	);
}
