import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import { Variant } from '@repo/enums';
import { IconCheck, IconExclamationMark, IconX } from '@tabler/icons-react';
import React from 'react';

export default function Notification({ variant }: { variant: Variant }) {
  switch (variant) {
    case Variant.FAILED:
      return <IconX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />;
    case Variant.WARNING:
      return (
        <IconExclamationMark size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
      );
    case Variant.SUCCESS:
      return <IconCheck size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />;
  }
}
