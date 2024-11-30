import { Icon } from '@tabler/icons-react';

export interface Team {
  name: string;
  title: string;
  image: string;
  socials: {
    icon: Icon;
    link: string;
  }[];
}

export interface Testimonial {
  content: string;
  cite: {
    person: { image: string; name: string; title: string };
    company: { image: string; name: string };
  };
}

export interface Pricing {
  title: string;
  desc: string;
  price: { monthly: number; annually: number };
  specs: string[];
  meta?: { popular: boolean };
}

export interface Discount {
  initial: number;
  current: number;
}
