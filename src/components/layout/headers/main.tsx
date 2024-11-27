import React from 'react';

import { Anchor, Group, ThemeIcon } from '@mantine/core';

import LayoutSection from '@/components/layout/section';

import classes from './main.module.scss';
import { dataContact, dataSocials } from '@/app/(marketing)/contact/page';
import { iconSize, iconStrokeWidth, iconWrapperSize } from '@/data/constants';

export default function Main() {
  return (
    <LayoutSection
      id="partial-header-main"
      padded="sm"
      className={classes.header}
      visibleFrom="xs"
    >
      <Group justify="space-between">
        <Group gap={'lg'}>
          {dataContact.map((item) => (
            <Group key={item.link} gap={6}>
              <item.icon
                size={iconSize}
                stroke={iconStrokeWidth}
                style={{ marginTop: 2 }}
              />
              <Anchor
                href={item.link}
                underline="hover"
                inherit
                fz={{ base: 'xs', lg: 'sm' }}
              >
                {item.label}
              </Anchor>
            </Group>
          ))}
        </Group>

        <Group>
          {dataSocials.map((social) => (
            <Anchor key={social.link} title={social.label} href={social.link}>
              <Group>
                <ThemeIcon size={iconWrapperSize}>
                  <social.icon size={iconSize} stroke={iconStrokeWidth} />
                </ThemeIcon>
              </Group>
            </Anchor>
          ))}
        </Group>
      </Group>
    </LayoutSection>
  );
}
