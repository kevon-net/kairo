'use client';

import React, { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';

import NextImage from 'next/image';

import { Carousel, CarouselSlide } from '@mantine/carousel';
import { images } from '@/assets/images';
import { Stack, Image, Anchor } from '@mantine/core';

export default function Partners() {
  const autoplay = useRef(Autoplay({ delay: 2000 }));

  return (
    <Carousel
      slideGap={'md'}
      loop
      draggable={false}
      withControls={false}
      slideSize={{
        base: `${100 / 2}%`,
        xs: `${100 / 3}%`,
        md: `${100 / 5}%`,
        lg: `${100 / 7}%`,
      }}
      slidesToScroll={1}
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
    >
      {slides}
    </Carousel>
  );
}

const partners = [
  {
    name: 'Microsoft',
    image: images.partners.partner1,
    link: 'http://microsoft.com',
  },
  {
    name: 'Office',
    image: images.partners.partner2,
    link: 'http://office.com',
  },
  {
    name: 'LinkedIn',
    image: images.partners.partner3,
    link: 'http://linkedin.com',
  },
  {
    name: 'Google',
    image: images.partners.partner4,
    link: 'http://office.com',
  },
  {
    name: 'Facebook',
    image: images.partners.partner5,
    link: 'http://facebook.com',
  },
];

const slides = partners.concat(partners).map((partner, index) => (
  <CarouselSlide key={index}>
    <Anchor href={partner.link} target="_blank" title={partner.name}>
      <Stack justify="center" align="center" h={'100%'}>
        <Image
          src={partner.image}
          alt={partner.name}
          w={'50%'}
          component={NextImage}
          width={1920}
          height={1080}
          priority
        />
      </Stack>
    </Anchor>
  </CarouselSlide>
));
