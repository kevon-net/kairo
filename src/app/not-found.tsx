import React from 'react';

import Link from 'next/link';
import NextImage from 'next/image';

import {
  Anchor,
  Grid,
  GridCol,
  Group,
  Stack,
  Text,
  Title,
  Image,
  Button,
  Flex,
} from '@mantine/core';

import { IconArrowLeft } from '@tabler/icons-react';

import LayoutSection from '@/components/layout/section';

import images from '@/data/images';
import appData from '@/data/app';
import { iconSize, iconStrokeWidth, sectionSpacing } from '@/data/constants';
import ModalCommunicationSupport from '@/components/common/modals/communication/support';

export default function NotFound() {
  return (
    <LayoutSection id={'page-not-found'}>
      <Stack justify="center" mih={'100vh'} py={sectionSpacing}>
        <Grid align="center">
          <GridCol span={{ base: 12, md: 5 }} order={{ base: 2, md: 1 }}>
            <Flex
              align={{ base: 'center', md: 'start' }}
              direction={'column'}
              gap={'xl'}
            >
              <Anchor component={Link} href={'/'} visibleFrom="md">
                <Group>
                  <Image
                    src={images.brand.logo.light}
                    alt={appData.name.app}
                    h={{ base: 48 }}
                    component={NextImage}
                    width={1920}
                    height={1080}
                    priority
                  />
                </Group>
              </Anchor>

              <Stack gap={'xs'}>
                <Title order={1} ta={{ base: 'center', md: 'start' }}>
                  Something&apos;s not right...
                </Title>
                <Text
                  ta={{ base: 'center', md: 'start' }}
                  w={{ xs: '80%', md: '100%' }}
                  mx={{ xs: 'auto' }}
                >
                  Page you are trying to open does not exist. You may have
                  mistyped the address, or the page has been moved to another
                  URL. If you think this is an error contact support.
                </Text>
              </Stack>

              <Flex
                direction={{ base: 'column', xs: 'row' }}
                align={'center'}
                gap={'md'}
              >
                <Button
                  leftSection={
                    <IconArrowLeft size={iconSize} stroke={iconStrokeWidth} />
                  }
                  component={Link}
                  href={'/'}
                  variant="light"
                >
                  Go To Home Page
                </Button>

                <ModalCommunicationSupport>
                  <Button>Contact Support</Button>
                </ModalCommunicationSupport>
              </Flex>
            </Flex>
          </GridCol>
          <GridCol span={{ base: 12, md: 7 }} order={{ base: 1, md: 2 }}>
            <Flex justify={{ base: 'center', md: 'end', lg: 'center' }}>
              <Group>
                <Image
                  src={images.error.err404}
                  alt={'Not Found'}
                  h={{ base: 120, xs: 160, md: 240, lg: 280, xl: 320 }}
                  component={NextImage}
                  width={1920}
                  height={1080}
                  priority
                />
              </Group>
            </Flex>
          </GridCol>
        </Grid>
      </Stack>
    </LayoutSection>
  );
}
