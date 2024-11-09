import React from "react";

import NextImage from "next/image";

import { Group, Image } from "@mantine/core";

import images from "@/data/images";
import appData from "@/data/app";

export default function Brand({ props }: { props?: { height?: number } }) {
	return (
		<Group>
			<Image
				src={images.brand.logo.light}
				alt={appData.name.app}
				h={{ base: props?.height || 24 }}
				component={NextImage}
				width={1920}
				height={1080}
				priority
			/>
		</Group>
	);
}
