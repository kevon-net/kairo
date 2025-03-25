import React from 'react';
import {
  Anchor,
  BackgroundImage,
  Box,
  Button,
  Center,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import LayoutSection from '@/components/layout/section';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  SECTION_SPACING,
} from '@/data/constants';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';

export default function Home() {
  return (
    <BackgroundImage
      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      c="white"
      pos={'relative'}
    >
      <Box
        pos={'absolute'}
        left={0}
        top={0}
        right={0}
        bottom={0}
        bg="linear-gradient(145deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.6) 100%)"
      />

      <LayoutSection id={'page-home-hero'} pos={'relative'} containerized="sm">
        <Stack
          justify="center"
          mih={'100vh'}
          pt={SECTION_SPACING * 2}
          pb={SECTION_SPACING}
          ta={'center'}
          gap={'xl'}
        >
          <Group justify="center">
            <Anchor component={Link} href={'#hero-home'} c={'white'}>
              <Paper
                withBorder
                bg={'transparent'}
                radius={'xl'}
                px={'xs'}
                py={4}
                style={{
                  border: '1.5px solid var(--mantine-color-gray-light)',
                }}
              >
                <Group gap={'xs'}>
                  <Text>
                    Announcing our next round of funding.{' '}
                    <Text component="span" inherit fw={'bold'}>
                      Read more
                    </Text>
                  </Text>

                  <Center visibleFrom="xs">
                    <IconArrowRight
                      size={ICON_SIZE}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  </Center>
                </Group>
              </Paper>
            </Anchor>
          </Group>

          <Title
            order={1}
            fz={{ base: 40, xs: 56, sm: 64, md: 72 }}
            ta={'center'}
            lh={1}
          >
            Data to enrich your online business
          </Title>

          <Text inherit fz={{ base: 'md', xs: 'lg', sm: 'xl' }}>
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
            lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.
          </Text>

          <Group justify="center">
            <Button>Get Started</Button>
            <Button
              variant="transparent"
              color={'white'}
              rightSection={
                <IconArrowRight size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              }
            >
              Learn More
            </Button>
          </Group>
        </Stack>
      </LayoutSection>
    </BackgroundImage>
  );
}
