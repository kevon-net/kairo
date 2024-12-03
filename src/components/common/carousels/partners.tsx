'use client';

import React, { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';

import { Carousel, CarouselSlide } from '@mantine/carousel';
import { images } from '@/assets/images';
import { Anchor, Center } from '@mantine/core';
import ImageDefault from '@/components/common/images/default';

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
    <Center>
      <Anchor href={partner.link} target="_blank" title={partner.name}>
        <ImageDefault
          src={partner.image}
          alt={partner.name}
          height={32}
          width={96}
          mode="grid"
        />
      </Anchor>
    </Center>
  </CarouselSlide>
));
