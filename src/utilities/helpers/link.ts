import { baseUrl } from '@/data/constants';
import { Platform } from '@/enums/social';

export const getShareLink = (
  platform: Platform,
  pathname: string,
  title: string
) => {
  const currentUrl = `${baseUrl}${pathname}`;

  switch (platform) {
    case Platform.TWITTER:
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(
        title
      )}`;
    case Platform.FACEBOOK:
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    case Platform.LINKEDIN:
      return `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
        currentUrl
      )}&title=${encodeURIComponent(title)}`;
    case Platform.WHATSAPP:
      return `https://wa.me/?text=${encodeURIComponent(`${title} - ${currentUrl}`)}`;

    default:
      return currentUrl;
  }
};
