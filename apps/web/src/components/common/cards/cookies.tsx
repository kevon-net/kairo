import React from 'react';
import { Anchor, Button, Card, Group, Stack, Text } from '@mantine/core';
import Link from 'next/link';
import classes from './cookies.module.scss';
import { setCookie } from '@repo/utils/helpers';
import { COOKIE_NAME } from '@/data/constants';
import { getExpiry } from '@/utilities/time';

export default function Cookies({ close }: { close: () => void }) {
  const handleConsentCookie = () => {
    setCookie(COOKIE_NAME.CONSENT.COOKIES, true, {
      expiryInSeconds: getExpiry(true).sec,
    });
    close();
  };

  return (
    <Card className={classes.card}>
      <Stack>
        <Text fz={'sm'}>
          This website uses cookies to supplement a balanced diet and provide a
          much deserved reward to the senses after consuming bland but
          nutritious meals. Accepting our cookies is optional but recommended,
          as they are delicious. See our{' '}
          <Anchor inherit component={Link} href="/legal/cookie-policy">
            cookie policy
          </Anchor>
          .
        </Text>

        <Group gap={'xs'}>
          <Button size="xs" onClick={handleConsentCookie}>
            Accept All
          </Button>
          <Button size="xs" onClick={close} variant="light">
            Reject All
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
