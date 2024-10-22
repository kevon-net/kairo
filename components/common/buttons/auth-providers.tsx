"use client";

import React from "react";

import NextImage from "next/image";

import { ActionIcon, Group, Image } from "@mantine/core";

import { signInWithProvider } from "@/handlers/event/sign-in";
import images from "@/data/images";

export default function Providers() {
	return (
		<Group justify="center">
			{providers.map((button) =>
				getButton(button.image, button.provider)
			)}
		</Group>
	);
}

const providers = [
	{
		image: images.icons.google,
		provider: "google"
	},
	{
		image: images.icons.social.facebook,
		provider: "facebook"
	}
];

const getButton = (image: string, provider: string) => (
	<ActionIcon
		size={40}
		radius={"xl"}
		variant="light"
		onClick={() => signInWithProvider(provider)}
	>
		<Group>
			<Image
				src={image}
				alt={provider}
				h={{ base: 24 }}
				component={NextImage}
				width={1920}
				height={1080}
				priority
			/>
		</Group>
	</ActionIcon>
);
