import { useState } from 'react';
import TextRequirement from '@/components/common/text/requirement';
import {
  PasswordInput,
  Progress,
  Popover,
  Stack,
  PopoverTarget,
  PopoverDropdown,
  PasswordInputProps,
} from '@mantine/core';
import { getPasswordStrength } from '@repo/utils/helpers';
import { PASSWORD_REQUIREMENTS } from '@/data/constants';

export default function PasswordStrength({
  value,
  ...restProps
}: { value: string } & PasswordInputProps) {
  const [opened, setOpened] = useState(false);

  const strength = getPasswordStrength(value, PASSWORD_REQUIREMENTS);
  const color = strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  const requirementList = PASSWORD_REQUIREMENTS.map((requirement, index) => (
    <TextRequirement
      key={index}
      label={`Includes a ${requirement.label}`}
      meets={requirement.re.test(value)}
    />
  ));

  return (
    <Popover
      opened={opened}
      position="bottom-start"
      width="target"
      styles={{ dropdown: { minWidth: 280 } }}
    >
      <PopoverTarget>
        <div
          onFocusCapture={() => setOpened(true)}
          onBlurCapture={() => setOpened(false)}
        >
          <PasswordInput value={value} {...restProps} />
        </div>
      </PopoverTarget>

      <PopoverDropdown>
        <Stack>
          <Progress color={color} value={strength} size={5} />

          <Stack gap={'xs'}>
            <TextRequirement
              key={'length'}
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
