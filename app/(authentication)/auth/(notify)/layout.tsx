import React from "react";

import NextImage from "next/image";
import Link from "next/link";

import { Anchor, Center, Grid, GridCol, Group, Image, Stack } from "@mantine/core";

import LayoutBody from "@/components/layout/body";
import LayoutSection from "@/components/layout/section";

import images from "@/data/images";
import appData from "@/data/app";
import { sectionSpacing } from "@/data/constants";

export default function Notify({
	children // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<LayoutBody>
			<Grid gutter={0} px={{ base: "md", xs: 0 }}>
				<GridCol span={5.5} visibleFrom="md" bg={"var(--mantine-color-pri-light)"}>
					<LayoutSection id={"layout-auth-notify-icon"} containerized="xs" pos={"sticky"} top={0}>
						<Stack gap={"xl"} align="center" justify="center" h={"100vh"} px={{ xs: 32 }}>
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
						</Stack>
					</LayoutSection>
				</GridCol>

				<GridCol span={{ base: 12, md: 6.5 }}>
					<LayoutSection id={"layout-auth-notify-text"} containerized="xs">
						<Stack gap={"xl"} justify="center" mih={"100vh"} px={{ xs: 32 }} py={sectionSpacing}>
							{children}
						</Stack>
					</LayoutSection>
				</GridCol>
			</Grid>
		</LayoutBody>
	);
}
