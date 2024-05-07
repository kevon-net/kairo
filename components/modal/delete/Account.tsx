"use client";

import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Stack, Text } from "@mantine/core";
import Form from "@/partials/forms";

export default function Account({ params }: { params: { userId: string } }) {
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<>
			<Modal opened={opened} onClose={close} centered title="Account Erasure">
				<Stack>
					<Text>
						Deleting your account will permanently remove all data associated with it.{" "}
						<Text component="span" inherit c="red.6">
							Proceed with caution. This action is irreversible.
						</Text>
					</Text>
					<Form.User.Account.Delete params={params} />
				</Stack>
			</Modal>

			<Button color="red.6" variant="light" onClick={open}>
				Delete Account
			</Button>
		</>
	);
}
