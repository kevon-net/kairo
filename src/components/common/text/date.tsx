'use client';

import { useRegionalDate } from '@/hooks/date';
import { FormatOptions } from '@/types/date-time';
import { Text, TextProps } from '@mantine/core';
import React from 'react';

export default function Date({
  date,
  options,
  ...restProps
}: {
  date: Date;
  options?: FormatOptions & { return?: 'date' | 'time' };
} & TextProps) {
  const { date: dateFormatted, time } = useRegionalDate(date, options);

  return (
    <Text component="span" {...restProps}>
      {options?.return == 'time' ? time : dateFormatted}
    </Text>
  );
}
