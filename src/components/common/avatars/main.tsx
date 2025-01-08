'use client';

import { useAppSelector } from '@/hooks/redux';
import { initialize } from '@/utilities/formatters/string';
import { Avatar, MantineStyleProps } from '@mantine/core';
import React from 'react';

import classes from './main.module.scss';

export default function Main({
  size = { base: 56, md: 120, lg: 56 },
}: {
  size?: MantineStyleProps['w'];
}) {
  const session = useAppSelector((state) => state.session.value);

  return !session ? (
    <Avatar className={classes.avatar} color="pri" w={size} h={size} />
  ) : (
    <Avatar
      className={
        !session.user_metadata.avatar_url
          ? classes.avatarInitials
          : classes.avatarImage
      }
      src={session.user_metadata.avatar_url || null}
      name={session.user_metadata.name || 'User'}
      color={'initials'}
      w={size}
      h={size}
    >
      {initialize(session.user_metadata.name || 'User')}
    </Avatar>
  );
}
