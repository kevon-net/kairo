import React from "react";
import { useParams } from "next/navigation";

import { Center, Container, Image, Stack } from "@mantine/core";

import Layout from "@/layouts";
import Partial from "@/partials";

export default function Reset() {
	const params = useParams<{ id: string; token: string }>();

	return (
		<Layout.Body>
			<Container size={"xs"}>
				<Center mih={"100vh"}>
					<Stack gap={"xl"} align="center" w={"100%"}>
						{/* <Image src={image.brand.full} w={160} /> */}
						<Partial.Form.Authentication.Reset params={{ id: params.id, token: params.token }} />
					</Stack>
				</Center>
			</Container>
		</Layout.Body>
	);
}
