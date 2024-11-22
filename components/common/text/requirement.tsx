import { iconSize, iconStrokeWidth } from "@/data/constants";
import { Group, Text } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import React from "react";

export default function Requirement({ meets, label }: { meets: boolean; label: string }) {
	return (
		<>
			<Group gap={"xs"} c={meets ? "teal" : "red"}>
				{meets ? (
					<IconCheck size={iconSize} stroke={iconStrokeWidth} />
				) : (
					<IconX size={iconSize} stroke={iconStrokeWidth} />
				)}

				<Text inherit fz="sm">
					{label}
				</Text>
			</Group>
		</>
	);
}
