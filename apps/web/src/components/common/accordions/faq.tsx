import React from 'react';

import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
} from '@mantine/core';

import sample from '@/data/sample';

import classes from './faq.module.scss';
import { isFirstItem } from '@/utilities/helpers/array';

export default function Faq() {
  const items = faqs.map((item) => (
    <AccordionItem
      key={item.q}
      value={item.q}
      mt={isFirstItem(faqs, item) ? undefined : 'md'}
    >
      <AccordionControl>{item.q}</AccordionControl>
      <AccordionPanel>{item.a}</AccordionPanel>
    </AccordionItem>
  ));

  return (
    <Accordion
      defaultValue={faqs[0].q}
      variant="separated"
      classNames={classes}
    >
      {items}
    </Accordion>
  );
}

const faqs = [
  {
    q: 'How long does a web design project take?',
    a: sample.text.prose,
  },
  {
    q: 'What factors affect the cost of web design?',
    a: sample.text.prose,
  },
  {
    q: 'Do you provide ongoing support?',
    a: sample.text.prose,
  },
  {
    q: 'What is your web design process?',
    a: sample.text.prose,
  },
];
