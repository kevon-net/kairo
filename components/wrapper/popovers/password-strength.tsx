import { useState } from "react";
import TextRequirement from "@/components/common/text/requirement";
import {
	PasswordInput,
	Progress,
	Popover,
	Stack,
	PopoverTarget,
	PopoverDropdown,
	PasswordInputProps
} from "@mantine/core";
import { getStrength } from "@/utilities/helpers/password";
import { passwordRequirements } from "@/data/constants";

export default function PasswordStrength({ value, ...restProps }: { value: string } & PasswordInputProps) {
	const [opened, setOpened] = useState(false);

	const strength = getStrength(value, passwordRequirements);
	const color = strength > 80 ? "teal" : strength > 50 ? "yellow" : "red";

	const requirementList = passwordRequirements.map((requirement, index) => (
		<TextRequirement key={index} label={`Includes a ${requirement.label}`} meets={requirement.re.test(value)} />
	));

	return (
		<Popover opened={opened} position="bottom-start" width="target" styles={{ dropdown: { minWidth: 280 } }}>
			<PopoverTarget>
				<div onFocusCapture={() => setOpened(true)} onBlurCapture={() => setOpened(false)}>
					<PasswordInput {...restProps} />
				</div>
			</PopoverTarget>

			<PopoverDropdown>
				<Stack>
					<Progress color={color} value={strength} size={5} />

					<Stack gap={"xs"}>
						<TextRequirement
							key={"length"}
							label="Includes at least 8 characters"
							meets={value.length >= 8}
						/>

						{requirementList}
					</Stack>
				</Stack>
			</PopoverDropdown>
		</Popover>
	);
}
