'use client';

import React from 'react';

import { Platform } from '@/enums/social';
import {
  ActionIconProps,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Text,
} from '@mantine/core';
import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandWhatsapp,
  IconShare,
} from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { BASE_URL, ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import { capitalizeWord } from '@/utilities/formatters/string';

import classes from './share.module.scss';

export default function Share({
  props,
}: { props: { postTitle: string } } & ActionIconProps) {
  const pathname = usePathname();

  return (
    <Menu
      shadow="xs"
      position="bottom-end"
      transitionProps={{ transition: 'pop-top-right' }}
      trigger="click-hover"
      classNames={classes}
    >
      <MenuTarget>
        <Group gap={6} c={'pri.6'} className={classes.target}>
          <IconShare size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
          <Text component="span" inherit>
            Share
          </Text>
        </Group>
      </MenuTarget>

      <MenuDropdown>
        {shareLinks.map((link) => (
          <MenuItem
            key={link.title}
            leftSection={
              <link.icon size={ICON_SIZE - 6} stroke={ICON_STROKE_WIDTH} />
            }
            component={'a'}
            href={getShareLink(link.title, pathname, props.postTitle)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {capitalizeWord(link.title)}
          </MenuItem>
        ))}
      </MenuDropdown>
    </Menu>
  );
}

const shareLinks = [
  {
    icon: IconBrandTwitter,
    title: Platform.TWITTER,
  },
  {
    icon: IconBrandFacebook,
    title: Platform.FACEBOOK,
  },
  {
    icon: IconBrandLinkedin,
    title: Platform.LINKEDIN,
  },
  {
    icon: IconBrandWhatsapp,
    title: Platform.WHATSAPP,
  },
];

export const getShareLink = (
  platform: Platform,
  pathname: string,
  title: string
) => {
  const currentUrl = `${BASE_URL}${pathname}`;

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
