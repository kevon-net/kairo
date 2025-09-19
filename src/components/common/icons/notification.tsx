import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import { Variant } from '@/enums/notification';
import {
  Icon,
  IconCheck,
  IconExclamationMark,
  IconX,
} from '@tabler/icons-react';
import React from 'react';

export default function Notification({
  props,
}: {
  props: { variant: Variant; icon?: Icon };
}) {
  switch (props.variant) {
    case Variant.FAILED:
      return <IconX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />;
    case Variant.WARNING:
      return (
        <IconExclamationMark size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
      );
    case Variant.SUCCESS:
      return <IconCheck size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />;
    case Variant.INFO:
      if (props.icon)
        return <props.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />;
  }
}
