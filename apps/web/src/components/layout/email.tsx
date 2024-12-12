import * as React from 'react';

import {
  Body,
  Container,
  Head,
  // Heading,
  Img,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import appData from '@/data/app';
import { BASE_URL } from '@/data/constants';
import { images } from '@/assets/images';

export default function Email({
  props,
  options = { withHeader: true, withFooter: true },
  children,
}: {
  props: { preview: string };
  options?: { withHeader?: boolean; withFooter?: boolean };
  children: React.ReactNode;
}) {
  return (
    <>
      <Html lang="en">
        <Head />
        <Preview>{props.preview}</Preview>

        <Body>
          <Container style={content}>
            {options.withHeader && (
              <Container style={container}>
                <Section style={header}>
                  {/* <Heading style={{ ...h1, textAlign: "center" }}>{appData.name.company}</Heading> */}

                  <Img
                    src={`${BASE_URL}${images.logo.dark}`}
                    width={128}
                    height={64}
                    alt={appData.name.company}
                  />
                </Section>
              </Container>
            )}

            <Container style={container}>
              <Section style={{ ...section, padding: '0px 20px' }}>
                {children}
              </Section>
            </Container>

            {options.withFooter && (
              <Container style={container}>
                <Section style={footer}>
                  <Text style={{ ...text, textAlign: 'center' }}>
                    Copyright © {new Date().getFullYear()},{' '}
                    {appData.name.company}. All rights reserved.
                  </Text>
                  <Text style={{ ...text, textAlign: 'center' }}>
                    This message was produced and distributed by{' '}
                    {appData.name.company}, or its affiliates.
                  </Text>
                  <Text style={{ ...text, textAlign: 'center' }}>
                    {appData.locations.main.location}
                  </Text>
                </Section>
              </Container>
            )}
          </Container>
        </Body>
      </Html>
    </>
  );
}

export const footer = {
  backgroundColor: 'black',
  color: 'white',
  padding: '20px 0',
};

export const header = {
  ...footer,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const container = {
  minWidth: '100%',
  padding: '0 20px',
};

export const section = {
  margin: '20px 0',
};

export const content = {
  maxWidth: '640px',
  margin: '0 auto',
  overflow: 'hidden',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

export const h1 = {
  fontSize: '24px',
  fontWeight: 'bolder',
};

export const h2 = {
  fontSize: '20px',
  fontWeight: 'bolder',
};

export const text = {
  margin: 0,
  fontSize: '12px',
};

export const link = {
  margin: 0,
  fontWeight: 'bold',
  color: 'red',
};
