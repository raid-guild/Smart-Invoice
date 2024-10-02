import { Alert, AlertIcon, AlertTitle, Button, Stack } from '@chakra-ui/react';
import { INVOICE_TYPES } from '@smartinvoicexyz/constants';
import {
  InstantButtonManager,
  InstantPaymentDetails,
  InvoiceButtonManager,
  InvoicePaymentDetails,
} from '@smartinvoicexyz/forms';
import { useInvoiceDetails } from '@smartinvoicexyz/hooks';
import {
  Container,
  InvoiceMetaDetails,
  InvoiceNotFound,
  Loader,
} from '@smartinvoicexyz/ui';
import { chainsMap } from '@smartinvoicexyz/utils';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { Hex, isAddress } from 'viem';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';

import { useOverlay } from '../../../../contexts/OverlayContext';

function ViewInvoice() {
  const router = useRouter();
  const { invoiceId: invId, chainId: hexChainId } = router.query;

  const invoiceId = _.toLower(String(invId)) as Hex;
  const invoiceChainId = hexChainId
    ? parseInt(String(hexChainId), 16)
    : undefined;

  const { invoiceDetails, isLoading } = useInvoiceDetails({
    chainId: invoiceChainId,
    address: invoiceId,
  });

  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const { switchChain } = useSwitchChain();

  const overlay = useOverlay();

  if (!isAddress(invoiceId) || (!invoiceDetails === null && !isLoading)) {
    return <InvoiceNotFound />;
  }

  if (!invoiceDetails || isLoading) {
    return (
      <Container overlay gap={10}>
        <Loader size="80" />
        If the invoice does not load,
        <br />
        please refresh the browser.
      </Container>
    );
  }

  const invoiceType = _.get(
    invoiceDetails,
    'invoiceType',
    INVOICE_TYPES.Escrow,
  );

  const { provider, client, resolver } = _.pick(invoiceDetails, [
    'provider',
    'client',
    'resolver',
  ]);

  const isProvider = _.toLower(address) === _.toLower(provider);
  const isClient = _.toLower(address) === _.toLower(client);
  const isResolver = _.toLower(address) === _.toLower(resolver);
  const isParty = isProvider || isClient || isResolver;
  const isInvalidChainId =
    isConnected && !!invoiceChainId && chainId !== invoiceChainId;

  const showNetworkError = isParty && isInvalidChainId;

  return (
    <Container overlay>
      <Stack
        spacing="2rem"
        justify="center"
        align="center"
        direction={{ base: 'column', lg: 'row' }}
        w="100%"
        px="1rem"
        py="8rem"
      >
        <InvoiceMetaDetails invoice={invoiceDetails} />

        <Stack minW={{ base: '90%', md: '50%' }}>
          {showNetworkError && (
            <Alert
              status="warning"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              py={6}
              mb={4}
              gap={4}
            >
              <AlertIcon boxSize="2rem" mr={0} />
              <AlertTitle fontWeight="normal">
                Warning! This invoice is on{' '}
                <b>{chainsMap(invoiceChainId)?.name}</b>, and you are connected
                to <b>{chainsMap(chainId)?.name ?? 'Unknown'}</b>.
              </AlertTitle>

              <Button
                bg="orange.600"
                _hover={{ bg: 'orange.700' }}
                onClick={() => switchChain?.({ chainId: invoiceChainId })}
              >
                Switch network to {chainsMap(invoiceChainId)?.name}
              </Button>
            </Alert>
          )}
          {invoiceType === INVOICE_TYPES.Escrow ? (
            <>
              <InvoicePaymentDetails invoice={invoiceDetails} {...overlay} />
              <InvoiceButtonManager invoice={invoiceDetails} {...overlay} />
            </>
          ) : (
            <>
              <InstantPaymentDetails invoice={invoiceDetails} />
              <InstantButtonManager invoice={invoiceDetails} {...overlay} />
            </>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}

export default ViewInvoice;
