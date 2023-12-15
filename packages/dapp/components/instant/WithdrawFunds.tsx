import React, { useEffect, useState } from 'react';
import { Hash, formatUnits } from 'viem';
import { useWalletClient } from 'wagmi';

import {
  Button,
  Heading,
  Link,
  Text,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';

import { ChainId } from '../../constants/config';
import { Invoice, TokenData } from '../../types';
import { getTokenInfo, getTxLink, logError } from '../../utils/helpers';
import { withdraw } from '../../utils/invoice';
import { waitForTransaction } from '../../utils/transactions';

export type WithdrawFundsProps = {
  invoice: Invoice;
  balance: bigint;
  close: () => void;
  tokenData: Record<ChainId, Record<string, TokenData>>;
};

export const WithdrawFunds: React.FC<WithdrawFundsProps> = ({
  invoice,
  balance,
  close,
  tokenData,
}) => {
  const [loading, setLoading] = useState(false);
  const { data: walletClient } = useWalletClient();
  const chainId = walletClient?.chain?.id;
  const { network, address, token } = invoice;

  const { decimals, symbol } = getTokenInfo(chainId, token, tokenData);
  const [txHash, setTxHash] = useState<Hash>();
  const [invalid, setInvalid] = useState(false);
  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' });

  useEffect(() => {
    if (!loading && walletClient && balance > 0) {
      setInvalid(false);
    } else {
      setInvalid(true);
    }
  }, [loading, network, balance, address, walletClient, close]);

  const send = async () => {
    try {
      if (!walletClient?.chain) return;
      setLoading(true);
      const hash = await withdraw(walletClient, address);
      setTxHash(hash);
      const { chain } = walletClient;
      await waitForTransaction(chain, hash);
      window.location.href = `/invoice/${chain.id.toString(
        16,
      )}/${address}/instant`;
      setLoading(false);
    } catch (withdrawError) {
      close();
      logError({ withdrawError });
    }
  };

  return (
    <VStack w="100%" spacing="1rem" color="black">
      <Heading
        fontWeight="normal"
        mb="1rem"
        textTransform="uppercase"
        textAlign="center"
      >
        Withdraw Funds
      </Heading>

      <Text textAlign="center" fontSize="sm" mb="1rem">
        Follow the instructions in your wallet to withdraw remaining funds from
        the invoice.
      </Text>

      <VStack
        my="2rem"
        px="5rem"
        py="1rem"
        bg="white"
        border="1px"
        borderColor="blue.1"
        borderRadius="0.5rem"
      >
        <Text color="blue.1" fontSize="0.875rem" textAlign="center">
          Amount To Be Withdrawn
        </Text>

        <Text
          color="blue.dark"
          fontSize="1rem"
          fontWeight="bold"
          textAlign="center"
        >{`${formatUnits(balance, decimals)} ${symbol}`}</Text>
      </VStack>
      {chainId && txHash && (
        <Text color="black" textAlign="center" fontSize="sm">
          Follow your transaction{' '}
          <Link
            href={getTxLink(chainId, txHash)}
            isExternal
            color="blue.1"
            textDecoration="underline"
          >
            here
          </Link>
        </Text>
      )}
      {!invalid && (
        <Button
          onClick={send}
          backgroundColor="blue.1"
          _hover={{ backgroundColor: 'rgba(61, 136, 248, 0.7)' }}
          _active={{ backgroundColor: 'rgba(61, 136, 248, 0.7)' }}
          color="white"
          textTransform="uppercase"
          size={buttonSize}
          fontFamily="mono"
          fontWeight="normal"
          w="100%"
          isLoading={loading}
        >
          Confirm
        </Button>
      )}

      <Button
        onClick={close}
        color="blue.1"
        // size={buttonSize}
        fontFamily="mono"
        fontWeight="normal"
      >
        Cancel
      </Button>
    </VStack>
  );
};
