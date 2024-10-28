"use client";

import React from "react";

import NextImage from "next/image";

import { Button, Group, Image, Stack } from "@mantine/core";

import { signInWithProvider } from "@/handlers/event/sign-in";
import images from "@/data/images";
import { capitalizeWords } from "@/utilities/formatters/string";

export default function Providers() {
	return <Stack>{providers.map((button) => getButton(button.image, button.provider))}</Stack>;
}

const providers = [
	{
		image: images.icons.google,
		provider: "google"
	}
];

const getButton = (image: string, provider: string) => (
	<Button
		fullWidth
		variant="light"
		onClick={() => signInWithProvider(provider)}
		leftSection={
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
		}
	>
		Continue with {capitalizeWords(provider)}
	</Button>
);
