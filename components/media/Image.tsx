import React from "react";

import NextImage from "next/image";

import { AspectRatio, Image as MantineImage } from "@mantine/core";

export default function Image({
	src,
	alt,
	width,
	height,
	...restProps
}: { src?: string; alt: string; width: number; height: number } & React.ComponentProps<typeof MantineImage>) {
	return (
		<AspectRatio ratio={width / height} w={width}>
			<MantineImage
				src={src}
				alt={alt}
				title={alt}
				// w={width}
				// h={height}
				loading="lazy"
				fallbackSrc={`https://placehold.co/${width}x${height}?text=Placeholder`}
				component={NextImage}
				{...restProps}
			/>
		</AspectRatio>
	);
}
