import React from 'react';

import { Metadata } from 'next';

import LayoutPage from '@/components/layout/page';
import LayoutSection from '@/components/layout/section';
import CardTeam from '@/components/common/cards/team';
import IntroPage from '@/components/layout/intro/page';
import IntroSection from '@/components/layout/intro/section';
import CarouselPartners from '@/components/common/carousels/partners';
import CarouselTestimonials from '@/components/common/carousels/testimonials';
import CardCtaInquiry from '@/components/common/cards/cta/inquiry';
import CardGenericPurpose from '@/components/common/cards/generic/purpose';
import ImageDefault from '@/components/common/images/default';

import appData from '@/data/app';
import { images } from '@/assets/images';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
  IconDiamond,
  IconRocket,
  IconTarget,
} from '@tabler/icons-react';
import { Grid, GridCol, Stack, Text, Title, Flex } from '@mantine/core';

export const metadata: Metadata = { title: 'About' };

export default async function About() {
  return (
    <LayoutPage>
      <IntroPage
        props={{
          path: `About ${appData.name.company}`,
          title: 'Empowering the World to Design',
          desc: `We are ${appData.name.company}, a Digital Product Design & Branding Agency. As a team of Designers, Business Analysts, Strategists, Content Writers, and Project Managers, we collaborate on a result-oriented design process.`,
        }}
      />

      <LayoutSection id={'page-about-intro'} margined>
        <Grid gutter={'xl'}>
          <GridCol
            span={{ base: 12, md: 6 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <IntroSection
              props={{
                subTitle: `Who we are`,
                title: `Know About ${appData.name.company}`,
              }}
              options={{ alignment: 'start' }}
            />

            <Stack mt={'md'}>
              <Text>
                At {appData.name.company}, we&apos;re not just in the business
                of digital solutions; we&apos;re in the business of crafting
                digital success stories. Founded on a passion for innovation and
                a commitment to excellence, we&apos;ve been at the forefront of
                the digital landscape, helping businesses like yours thrive in
                the digital age.
              </Text>

              <Text>
                Our story begins with a vision – a vision to transform the
                digital experience for businesses of all sizes. Over the years,
                we&apos;ve evolved from a small startup to a dynamic digital
                agency with a global footprint.
              </Text>

              <Text>
                To empower businesses to achieve their digital goals. We believe
                that the digital realm offers boundless opportunities for growth
                and connection, and we&apos;re here to guide you through this
                transformative journey.
              </Text>
            </Stack>
          </GridCol>

          <GridCol span={{ base: 12, md: 6 }}>
            <Grid gutter={'xl'} justify="center">
              <GridCol span={{ base: 12, md: 6 }}>
                <Grid gutter={'xl'}>
                  <GridCol span={{ md: 12, xs: 6 }}>
                    <ImageDefault
                      src={images.about.team2}
                      decorative
                      height={{ base: 240, xs: 160, md: 200 }}
                      mode="grid"
                      radius={'sm'}
                    />
                  </GridCol>
                  <GridCol span={{ md: 12, xs: 6 }}>
                    <ImageDefault
                      src={images.about.team3}
                      decorative
                      height={{ base: 240, xs: 160, md: 240 }}
                      mode="grid"
                      radius={'sm'}
                    />
                  </GridCol>
                </Grid>
              </GridCol>
              <GridCol span={{ base: 12, xs: 6 }}>
                <ImageDefault
                  src={images.about.team1}
                  decorative
                  height={{ base: 240, xs: 160, md: '100%' }}
                  mode="grid"
                  radius={'sm'}
                />
              </GridCol>
            </Grid>
          </GridCol>
        </Grid>
      </LayoutSection>

      <LayoutSection
        id={'page-about-partners'}
        bg={
          'light-dark(var(--mantine-color-pri-light), var(--mantine-color-gray-light))'
        }
        padded
      >
        <CarouselPartners />
      </LayoutSection>

      <LayoutSection id={'page-about-partners'} margined>
        <IntroSection
          props={{
            subTitle: `Purpose`,
            title: 'Our Principles That Keep Us Moving Forward Together',
            desc: `Quis tellus eget adipiscing convallis sit sit eget aliquet quis. Suspendisse eget egestas a elementum pulvinar et feugiat blandit at. In mi viverra elit nunc.`,
          }}
          options={{ spacing: true }}
        />

        <Grid>
          {purpose.map((item) => (
            <GridCol key={item.title} span={{ base: 12, xs: 6, sm: 4 }}>
              <CardGenericPurpose props={item} />
            </GridCol>
          ))}
        </Grid>
      </LayoutSection>

      <LayoutSection
        id={'page-about-team'}
        padded
        bg={'var(--mantine-color-gray-light)'}
      >
        <IntroSection
          props={{
            subTitle: `Behind The ${appData.name.company}`,
            title: 'Our Leadership Team',
            desc: `Working from all around the world to build the Web of tomorrow.`,
          }}
          options={{ spacing: true }}
        />

        <Grid gutter={'xl'}>
          {team.map((member) => (
            <GridCol key={member.name} span={{ base: 12, xs: 6, md: 3 }}>
              <CardTeam props={member} />
            </GridCol>
          ))}
        </Grid>
      </LayoutSection>

      <LayoutSection
        id={'page-about-partners'}
        bg={
          'linear-gradient(-60deg, var(--mantine-color-pri-4) 0%, var(--mantine-color-pri-7) 100%)'
        }
        c={'var(--mantine-color-white)'}
        padded
      >
        <Grid gutter={'xl'}>
          {stats.map((stat) => (
            <GridCol key={stat.title} span={{ base: 6, sm: 3 }}>
              <Flex direction={'column-reverse'} gap={'xs'}>
                <Title order={3} fz={'md'} fw={500} ta={'center'}>
                  {stat.title}
                </Title>

                <Text fz={32} fw={'bold'} ta={'center'}>
                  {stat.stat}
                </Text>
              </Flex>
            </GridCol>
          ))}
        </Grid>
      </LayoutSection>

      <LayoutSection id={'page-about-team'} margined>
        <IntroSection
          props={{
            subTitle: `Success Stories`,
            title: "We've Worked With Thousands of Amazing People",
            desc: `Read the real-life success stories of the users, companies, and industries.`,
          }}
          options={{ spacing: true }}
        />

        <CarouselTestimonials />
      </LayoutSection>

      <LayoutSection id={'page-about-team'} margined>
        <CardCtaInquiry />
      </LayoutSection>
    </LayoutPage>
  );
}

const purpose = [
  {
    icon: IconRocket,
    title: 'Our Mission',
    desc: 'With technology at our core, we build global infrastructure and applications to empower businesses to operate anywhere, anytime.',
  },
  {
    icon: IconDiamond,
    title: 'Our Visions',
    desc: 'To be the global economic infrastructure to empower businesses of all sizes to grow without borders.',
  },
  {
    icon: IconTarget,
    title: 'Our Purpose',
    desc: 'To connect the entrepreneurs, business builders, makers and creators with borderless opportunities in every corner of the world.',
  },
];

const team = [
  {
    name: 'Michael Foster',
    title: 'Co-Founder & CEO',
    image: images.team.team4,
    socials: [
      {
        icon: IconBrandX,
        link: '#x',
      },
      {
        icon: IconBrandFacebook,
        link: '#facebook',
      },
      {
        icon: IconBrandInstagram,
        link: '#instagram',
      },
    ],
  },
  {
    name: 'Leslie Alexander',
    title: 'Co-Founder',
    image: images.team.team3,
    socials: [
      {
        icon: IconBrandX,
        link: '#x',
      },
      {
        icon: IconBrandFacebook,
        link: '#facebook',
      },
      {
        icon: IconBrandInstagram,
        link: '#instagram',
      },
    ],
  },
  {
    name: 'Dries Vincent',
    title: 'Creative Director',
    image: images.team.team2,
    socials: [
      {
        icon: IconBrandX,
        link: '#x',
      },
      {
        icon: IconBrandFacebook,
        link: '#facebook',
      },
      {
        icon: IconBrandInstagram,
        link: '#instagram',
      },
    ],
  },
  {
    name: 'Courtney Henry',
    title: 'Lead Developer',
    image: images.team.team1,
    socials: [
      {
        icon: IconBrandX,
        link: '#x',
      },
      {
        icon: IconBrandFacebook,
        link: '#facebook',
      },
      {
        icon: IconBrandInstagram,
        link: '#instagram',
      },
    ],
  },
];

const stats = [
  {
    title: 'Founded',
    stat: '2028',
  },
  {
    title: 'Projects Shipped',
    stat: '425+',
  },
  {
    title: 'Team Members',
    stat: '55+',
  },
  {
    title: 'Clutch Rating',
    stat: '4.9',
  },
];
