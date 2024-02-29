import React from "react";

import NextImage from "next/image";

import { AspectRatio, Image } from "@mantine/core";

export default function MediaImage({
	ratio,
	src,
	alt,
	width,
	height,
	...restProps
}: { ratio?: number; src?: string; alt: string; width: number; height: number } & React.ComponentProps<typeof Image>) {
	return (
		<AspectRatio ratio={ratio} w={width}>
			<Image
				src={src}
				alt={alt}
				width={width}
				height={height}
				fallbackSrc={`https://placehold.co/${height}x${height}?text=Placeholder`}
				component={NextImage}
				{...restProps}
			/>
		</AspectRatio>
	);
}
