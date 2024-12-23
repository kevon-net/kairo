import sample from './sample';

const companyName = 'Brix';
const appName = companyName;
const companyOneLiner = sample.text.sentence;
const companyDescription = sample.text.prose;

export const phones = {
  main: '(254) 123 456-789',
};

export const emails = {
  info: process.env.NEXT_PUBLIC_EMAIL_INFO,
  noreply: process.env.NEXT_PUBLIC_EMAIL_NOREPLY,
};

export const socials = {
  twitter: {
    platform: `X`,
    link: '#twitter',
  },
  facebook: {
    platform: `Facebook`,
    link: '#facebook',
  },
  instagram: {
    platform: `Instagram`,
    link: '#instagram',
  },
  linkedin: {
    platform: `LinkedIn`,
    link: '#linkedin',
  },
};

export const hours = {
  days: 'Mon - Fri',
  times: '8 AM - 5 PM',
};

export const locations = {
  main: {
    location: '410 Terry Ave. North, Seattle, WA 98109',
    pin: '#pin',
  },
};

const appData = {
  companyOneLiner,
  companyDescription,

  name: { company: companyName, app: appName },
  phones,
  emails,
  socials,
  hours,
  locations,
};

export default appData;
