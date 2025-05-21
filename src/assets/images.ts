import { BASE_URL } from '@/data/constants';

const imageUrl = `${BASE_URL}/images`;
const iconUrl = `https://img.icons8.com`;

export const images = {
  brand: {
    logo: {
      light: `${imageUrl}/logos/brand/logo-light.png`,
      dark: `${imageUrl}/logos/brand/logo-dark.png`,
    },
    icon: {
      light: `${imageUrl}/avatars/brand/icon/icon-light.png`,
      dark: `${imageUrl}/avatars/brand/icon/icon-dark.png`,
    },
  },

  icons: {
    social: {
      facebook: `${iconUrl}/?size=100&id=13912&format=png&color=000000`,
      instagram: `${iconUrl}/?size=100&id=32323&format=png&color=000000`,
      twitterx: `${iconUrl}/?size=100&id=ClbD5JTFM7FA&format=png&color=000000`,
      linkedin: `${iconUrl}/?size=100&id=13930&format=png&color=000000`,
      whatsapp: `${iconUrl}/?size=100&id=16713&format=png&color=000000`,
    },

    google: `${iconUrl}/?size=100&id=17949&format=png&color=000000`,
    credentials: `${iconUrl}/?size=100&id=jicLxt1sA2qa&format=png&color=000000`,
  },
};
