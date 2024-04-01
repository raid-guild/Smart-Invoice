import {
  Box,
  Button,
  Flex,
  Image,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import { ChakraNextLink, ConnectWeb3 } from '@smart-invoice/ui';
import _ from 'lodash';

import { HamburgerIcon } from '../icons/HamburgerIcon';
import { theme } from '../theme';

export const StyledButton = styled(Button)`
  &::after {
    box-sizing: inherit;
    transition: all ease-in-out 0.2s;
    background: none repeat scroll 0 0 ${theme.colors.red[500]};
    content: '';
    display: block;
    height: 2px;
    width: 0;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  &:hover {
    text-decoration: none;
    ::after {
      width: 100%;
    }
  }
`;

const links = [
  { label: 'Dashboard', href: '/invoices' },
  { label: 'Documentation', href: 'https://docs.smartinvoice.xyz' },
  {
    label: 'Support',
    href: 'https://docs.smartinvoice.xyz/misc/get-support',
  },
];

export function Header() {
  const { isOpen, onToggle } = useDisclosure();

  const [upTo780] = useMediaQuery('(max-width: 780px)');

  return (
    <Flex
      w="100%"
      h={75}
      paddingX={8}
      paddingY={4}
      color="#707683"
      fontFamily="mono"
      top={0}
      left={0}
      justify="space-between"
      align="center"
      background="white"
      zIndex={5}
    >
      <Box width="230px">
        <ChakraNextLink href="/invoices">
          <Flex cursor="pointer">
            <Image
              src="/assets/smart-invoice/normal.svg"
              alt="Smart Invoice"
              height={34.84}
            />
          </Flex>
        </ChakraNextLink>
      </Box>

      {/* Navigation Links */}
      {!upTo780 && (
        <Flex gap={8} justify="center" align="center">
          {_.map(links, ({ label, href }) => (
            <ChakraNextLink
              key={href}
              href={href}
              isExternal={!href?.startsWith('/')}
            >
              {label}
            </ChakraNextLink>
          ))}
        </Flex>
      )}

      <Flex
        align="center"
        height="8rem"
        transition="width 1s ease-out"
        justify="end"
      >
        {!upTo780 && (
          <Flex justifyContent="flex-end" width="230px">
            <ConnectWeb3 />
          </Flex>
        )}
        {upTo780 && (
          <Button
            onClick={onToggle}
            variant="link"
            ml={{ base: '0.5rem', sm: '1rem' }}
            zIndex={7}
          >
            <HamburgerIcon
              boxSize={{ base: '2rem', sm: '2.75rem' }}
              transition="all 1s ease-out"
              _hover={{
                transition: 'all 1s ease-out',
                transform: 'rotateZ(90deg)',
              }}
              color="blue.1"
            />
          </Button>
        )}
      </Flex>

      <Flex
        zIndex={6}
        position="fixed"
        left="0"
        top="0"
        bg="white"
        h="100%"
        w="100%"
        direction="column"
        justify="center"
        align="center"
        transition="all 2s ease-out"
        pointerEvents={isOpen ? 'all' : 'none'}
        css={{
          clipPath: isOpen
            ? 'circle(calc(100vw + 100vh) at 90% -10%)'
            : 'circle(100px at 90% -20%)',
        }}
      >
        <Flex height="60px" alignItems="center">
          <ConnectWeb3 />
        </Flex>

        {_.map(links, ({ label, href }) => (
          <ChakraNextLink
            href={href}
            key={href}
            isExternal={!href?.startsWith('/')}
          >
            <StyledButton
              transition="all 0.5s ease 0.4s"
              my="1rem"
              variant="link"
              color="gray"
              fontWeight="normal"
              fontSize="1.5rem"
            >
              {label}
            </StyledButton>
          </ChakraNextLink>
        ))}
      </Flex>
    </Flex>
  );
}
