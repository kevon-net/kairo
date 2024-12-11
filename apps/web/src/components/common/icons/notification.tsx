import { iconSize, iconStrokeWidth } from '@/data/constants';
import { Variant } from '@repo/enums';
import { IconCheck, IconExclamationMark, IconX } from '@tabler/icons-react';
import React from 'react';

export default function Notification({ variant }: { variant: Variant }) {
  switch (variant) {
    case Variant.FAILED:
      return <IconX size={iconSize} stroke={iconStrokeWidth} />;
    case Variant.WARNING:
      return <IconExclamationMark size={iconSize} stroke={iconStrokeWidth} />;
    case Variant.SUCCESS:
      return <IconCheck size={iconSize} stroke={iconStrokeWidth} />;
  }
}
