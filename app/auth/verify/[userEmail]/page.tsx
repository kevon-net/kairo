import React from "react";
import { useParams } from "next/navigation";

import { Center, Container, Image, Stack } from "@mantine/core";

import Layout from "@/layouts";
import Partial from "@/partials";

export default function Verify() {
	const params = useParams<{ userEmail: string }>();

	return (
		<Layout.Body>
			<Container size={"xs"}>
				<Center mih={"100vh"}>
					<Stack gap={"xl"} align="center" w={"100%"}>
						{/* <Image src={image.brand.full} w={160} /> */}
						<Partial.Form.Authentication.Verify userEmail={params.userEmail} />
					</Stack>
				</Center>
			</Container>
		</Layout.Body>
	);
}
