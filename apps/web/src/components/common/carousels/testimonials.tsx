'use client';

import React, { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';

import { Carousel, CarouselSlide } from '@mantine/carousel';
import { images } from '@/assets/images';
import CardTestimonial from '../cards/testimonial';

import classes from './testimonial.module.scss';
import { SECTION_SPACING } from '@/data/constants';

export default function Testimonials() {
  const autoplay = useRef(Autoplay({ delay: 2000 }));

  return (
    <Carousel
      slideGap={0}
      loop
      draggable={false}
      withIndicators
      withControls={false}
      slideSize={{
        base: `${100 / 1}%`,
        xs: `${100 / 2}%`,
        md: `${100 / 3}%`,
        xl: `${100 / 4}%`,
      }}
      slidesToScroll={1}
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
      classNames={classes}
    >
      {slides}
    </Carousel>
  );
}

const testimonials = [
  {
    content:
      'Lorem ipsum dolor sit amet cons ectetur adipiscing elit uisque sagittis risus sed dolor lobortis, non rutrum massa ultricies aecenas tempor, nisi nec tempus lobortis.',
    cite: {
      person: {
        name: 'Tom Cook',
        image: images.clients.client1,
        title: 'Copywriter',
      },
      company: {
        name: 'Microsoft',
        image: images.partners.partner1,
      },
    },
  },
  {
    content:
      'Aenean pharetra finibus mauris a porttitor. Nam dui tortor, finibus sit amet feugiat porta, tempus in odio. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    cite: {
      person: {
        name: 'Lindsay Walton',
        image: images.clients.client2,
        title: 'Senior Designer',
      },
      company: {
        name: 'Office',
        image: images.partners.partner2,
      },
    },
  },
  {
    content:
      'Pellentesque sit amet turpis porta augue pretium dictum. Pellentesque commodo bitur ut massa cursus, congue augue vitae, efficitur metus..',
    cite: {
      person: {
        name: 'Leonard Krasner',
        image: images.clients.client3,
        title: 'Business Relations',
      },
      company: {
        name: 'LinkedIn',
        image: images.partners.partner3,
      },
    },
  },
  {
    content:
      'Pellentesque sit amet turpis porta augue pretium dictum. Pellentesque commodo bitur ut massa cursus, congue augue vitae, efficitur metus..',
    cite: {
      person: {
        name: 'Joseph Rodriguez',
        image: images.clients.client4,
        title: 'Business Relations',
      },
      company: {
        name: 'Google',
        image: images.partners.partner4,
      },
    },
  },
];

const slides = testimonials.concat(testimonials).map((testimonial, index) => (
  <CarouselSlide key={index} mb={SECTION_SPACING / 1.5}>
    <CardTestimonial props={testimonial} />
  </CarouselSlide>
));
