import React from "react";

import NextImage from "next/image";
import Link from "next/link";

import {
	Anchor,
	Center,
	Grid,
	GridCol,
	Group,
	Image,
	Stack,
	Text,
	Title
} from "@mantine/core";

import LayoutBody from "@/components/layout/body";
import LayoutSection from "@/components/layout/section";

import images from "@/data/images";
import appData from "@/data/app";

export interface typeParams {
	userId: string;
	token: string;
}

export default function LayoutDefault({
	children // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<LayoutBody>
			<Grid gutter={0}>
				<GridCol span={6} visibleFrom="md">
					<Center h={"100%"} bg={"var(--mantine-color-pri-light)"}>
						<LayoutSection
							id={"layout-default"}
							margined
							containerized={"sm"}
							px={"xl"}
							pos={"relative"}
						>
							<Stack gap={64}>
								<Anchor component={Link} href={"/"}>
									<Group>
										<Image
											src={images.brand.logo.light}
											alt={appData.name.app}
											h={{ base: 48 }}
											component={NextImage}
											width={1920}
											height={1080}
											priority
										/>
									</Group>
								</Anchor>

								<Stack gap={"xs"}>
									<Title
										order={1}
										ta={{ base: "center", md: "start" }}
									>
										Welcome to Brix!
									</Title>
									<Text
										ta={{ base: "center", md: "start" }}
										w={{ md: "66%" }}
									>
										{appData.companyOneLiner}
									</Text>
								</Stack>
							</Stack>
						</LayoutSection>
					</Center>
				</GridCol>

				<GridCol span={{ base: 12, md: 6 }}>
					<Center mih={"100vh"} px={{ md: 40 }}>
						{children}
					</Center>
				</GridCol>
			</Grid>
		</LayoutBody>
	);
}
