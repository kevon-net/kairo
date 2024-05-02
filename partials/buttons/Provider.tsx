"use client";

import React from "react";

import NextImage from "next/image";

import { Button, Stack, Image } from "@mantine/core";

import asset from "@/assets";

import { signIn } from "next-auth/react";

export default function Provider({ providers, callBackUrl = "/" }: { providers: any; callBackUrl?: string }) {
	const providerOptions = [
		{
			id: "google",
			icon: asset.icon.search.google,
			color: "blue",
		},
		// {
		// 	id: "email",
		// 	icon: asset.icon.other.email,
		// 	color: "gray",
		// },
	];

	const selectProvider = (pid: string) => providerOptions.find(provider => provider.id == pid);

	return (
		<Stack gap={"xs"}>
			{Object.values(providers).map(
				provider =>
					provider.id != "credentials" &&
					providerOptions.find(p => p.id == provider.id) && (
						<Button
							key={provider.id}
							variant="light"
							color={selectProvider(provider.id)?.color}
							leftSection={
								<Image
									src={selectProvider(provider.id)?.icon}
									alt={`${selectProvider(provider.id)?.name}`}
									w={24}
									h={24}
									component={NextImage}
									priority
								/>
							}
							onClick={async () => await signIn(provider.id, { callbackUrl: callBackUrl })}
						>
							Continue with {provider.name}
						</Button>
					)
			)}
		</Stack>
	);
}
