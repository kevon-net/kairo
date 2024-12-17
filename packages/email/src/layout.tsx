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
  Link,
} from '@react-email/components';
import appData from './data/app';
import { BASE_URL } from './data/constants';

export default function Email({
  props,
  options = { withHeader: false, withFooter: true },
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
              <Section style={header}>
                <Container style={container}>
                  {/* <Heading style={{ ...h1, textAlign: "center" }}>{appData.name.company}</Heading> */}

                  <Img
                    src={`${BASE_URL}`}
                    width={128}
                    height={64}
                    alt={appData.name.company}
                  />
                </Container>
              </Section>
            )}

            <Section style={section}>
              <Container style={container}>{children}</Container>
            </Section>

            {options.withFooter && (
              <Section style={{ ...section, ...footer }}>
                <Container style={container}>
                  <Text style={{ ...text, fontSize: '10px', color: 'gray' }}>
                    Copyright © {new Date().getFullYear()},{' '}
                    <Link
                      href="#"
                      style={{
                        color: 'gray',
                        textDecorationLine: 'underline',
                      }}
                    >
                      {appData.name.company}
                    </Link>
                    . All rights reserved.
                  </Text>

                  <Text style={{ ...text, fontSize: '10px', color: 'gray' }}>
                    {appData.locations.main.location}
                  </Text>

                  {/* <Text style={{ ...text, fontSize: '10px', color: 'gray' }}>
                    This message was produced and distributed by{' '}
                    {appData.name.company}, or its affiliates.
                  </Text> */}

                  <Text style={{ ...text, fontSize: '10px', color: 'gray' }}>
                    <Link
                      href="#"
                      style={{
                        color: 'gray',
                        textDecorationLine: 'underline',
                      }}
                    >
                      Unsubscribe
                    </Link>{' '}
                    |{' '}
                    <Link
                      href="#"
                      style={{
                        color: 'gray',
                        textDecorationLine: 'underline',
                      }}
                    >
                      Manage Preferences
                    </Link>
                  </Text>
                </Container>
              </Section>
            )}
          </Container>
        </Body>
      </Html>
    </>
  );
}

export const footer = {};

export const header = {
  ...footer,
  display: 'flex',
  alignItems: 'center',
  // justifyContent: 'center',
};

export const container = {
  minWidth: '100%',
  padding: '0 16px',
};

export const section = {
  margin: '16px 0',
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
  fontSize: '16px',
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
