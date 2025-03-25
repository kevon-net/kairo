import React from 'react';

import Link from 'next/link';

import {
  Flex,
  Grid,
  Text,
  Title,
  List,
  Anchor,
  Divider,
  Group,
  GridCol,
  ListItem,
  ThemeIcon,
  Stack,
} from '@mantine/core';

import LayoutSection from '@/components/layout/section';

import { images } from '@/assets/images';

import classes from './main.module.scss';
import appData from '@/data/app';
import { dataSocials } from '@/app/(marketing)/contact/page';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
} from '@/data/constants';
import SegmentedControlTheme from '@/components/common/segmented-control/theme';
import { IconCircleFilled } from '@tabler/icons-react';
import FormNewsletter from '@/components/form/newsletter';
import ImageDefault from '@/components/common/images/default';

export default function Main() {
  return (
    <LayoutSection id={'partial-footer-main'} padded className={classes.footer}>
      <Stack gap={SECTION_SPACING}>
        <Flex align={'center'} justify={{ base: 'center', md: 'start' }}>
          <Anchor component={Link} href={'/'}>
            <ImageDefault
              src={images.brand.logo.light}
              alt={appData.name.app}
              height={{ base: 40 }}
              width={{ base: 96 }}
              fit="contain"
              mode="grid"
            />
          </Anchor>
        </Flex>

        <Grid gutter={{ base: 'xl', md: 'md' }}>
          {linkSets.map((linkSet) => (
            <GridCol key={linkSet.title} span={{ base: 6, sm: 3 }}>
              <Flex
                direction={'column'}
                align={{ base: 'center', md: 'start' }}
                gap={'xl'}
              >
                <Title order={4} fw={500}>
                  {linkSet.title}
                </Title>

                <List listStyleType="none" spacing={'md'}>
                  {linkSet.links.map((link) => (
                    <ListItem key={link.link} className={classes.listItem}>
                      <Anchor
                        component={Link}
                        href={link.link}
                        title={link.label}
                        className={classes.link}
                      >
                        {link.label}
                      </Anchor>
                    </ListItem>
                  ))}
                </List>
              </Flex>
            </GridCol>
          ))}
        </Grid>

        <Flex
          direction={{ base: 'column', sm: 'row' }}
          align={{ base: 'center', sm: 'end' }}
          justify={{ sm: 'space-between' }}
          gap={'lg'}
        >
          <Flex
            direction={'column'}
            align={{ base: 'center', sm: 'start' }}
            gap={'lg'}
          >
            <Stack gap={'xs'}>
              <Title order={3} fz={'lg'} ta={{ base: 'center', sm: 'start' }}>
                Subscribe to our newsletter
              </Title>
              <Text c={'dimmed'} ta={{ base: 'center', sm: 'start' }}>
                The latest news, articles, and resources, sent to your inbox
                weekly.
              </Text>
            </Stack>

            <FormNewsletter />
          </Flex>

          <Group>
            {dataSocials.map((social) => (
              <Anchor key={social.link} title={social.label} href={social.link}>
                <Group>
                  <ThemeIcon size={ICON_WRAPPER_SIZE} variant="default">
                    <social.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                  </ThemeIcon>
                </Group>
              </Anchor>
            ))}
          </Group>
        </Flex>
      </Stack>

      <Divider
        mt={SECTION_SPACING}
        mb={SECTION_SPACING / 2}
        color="var(--mantine-color-default-border)"
      />

      <Stack gap={'lg'} fz={'sm'} ta={{ base: 'center', md: 'start' }} lh={1}>
        <Flex
          align={'center'}
          justify={{ sm: 'space-between' }}
          direction={{ base: 'column', sm: 'row' }}
          gap={'md'}
        >
          <Text component="span" inherit>
            © {new Date().getFullYear()} {appData.name.app}, Inc. All Rights
            Reserved.
          </Text>

          <Group gap={'xs'}>
            <Anchor
              component={Link}
              inherit
              href="#tc"
              className={classes.link}
            >
              Terms and Conditions
            </Anchor>

            <IconCircleFilled size={4} />

            <Anchor
              component={Link}
              inherit
              href="#pp"
              className={classes.link}
            >
              Privacy Policy
            </Anchor>
          </Group>
        </Flex>

        <Flex justify={{ base: 'center', sm: 'start' }}>
          <SegmentedControlTheme />
        </Flex>
      </Stack>
    </LayoutSection>
  );
}

const linkSets = [
  {
    title: 'About Us',
    links: [
      { label: 'Mission', link: '#Mission' },
      { label: 'Our Team', link: '#Team' },
      { label: 'Awards', link: '#Awards' },
      { label: 'Testimonials', link: '#Testimonials' },
      { label: 'Privacy Policy', link: '#Policy' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Web Design', link: '#Design' },
      { label: 'Web Development', link: '#Development' },
      { label: 'Mobile Design', link: '#Mobile' },
      { label: 'UI/UX Design', link: '#UX' },
      { label: 'Branding Design', link: '#Branding' },
    ],
  },
  {
    title: 'Portfolio',
    links: [
      { label: 'Corporate Websites', link: '#Corporate' },
      { label: 'E-commerce', link: '#commerce' },
      { label: 'Mobile Apps', link: '#Apps' },
      { label: 'Landing Pages', link: '#Landing' },
      { label: 'UI/UX Projects', link: '#Projects' },
    ],
  },
  {
    title: 'Contact Us',
    links: [
      { label: 'Information', link: '#Information' },
      { label: 'Request a Quote', link: '#Quote' },
      { label: 'Consultation', link: '#Consultation' },
      { label: 'Help Center', link: '#Help' },
      { label: "T's and C's", link: '#Terms' },
    ],
  },
];
