import { Button, Heading, Spinner, Stack, Text } from '@chakra-ui/react';
import { InvoiceDetails } from '@smartinvoicexyz/graphql';
import { useWithdraw } from '@smartinvoicexyz/hooks';
import { useToast } from '@smartinvoicexyz/ui';
import { useQueryClient } from '@tanstack/react-query';
// import { getTxLink } from '@smartinvoicexyz/utils';
import _ from 'lodash';

export function WithdrawFunds({
  invoice,
  onClose,
}: {
  invoice: InvoiceDetails;
  onClose: () => void;
}) {
  const toast = useToast();

  const { tokenBalance } = _.pick(invoice, ['tokenBalance']);
  const queryClient = useQueryClient();

  const onTxSuccess = () => {
    // invalidate cache
    queryClient.invalidateQueries({
      queryKey: ['invoiceDetails'],
    });
    queryClient.invalidateQueries({ queryKey: ['extendedInvoiceDetails'] });
    // close modal
    onClose();
  };

  const { writeAsync: withdrawFunds, isLoading } = useWithdraw({
    invoice,
    onTxSuccess,
    toast,
  });

  return (
    <Stack w="100%" spacing="1rem">
      <Heading
        mb="1rem"
        as="h3"
        fontSize="2xl"
        transition="all ease-in-out .25s"
        _hover={{ cursor: 'pointer', color: 'raid' }}
      >
        Withdraw Funds
      </Heading>
      <Text textAlign="center" fontSize="sm" mb="1rem" w="70%">
        Follow the instructions in your wallet to withdraw remaining funds from
        the escrow.
      </Text>
      <Stack my="2rem" px="5rem" py="1rem" bg="black" borderRadius="0.5rem">
        <Text color="primary.300" fontSize="0.875rem" textAlign="center">
          Amount To Be Withdrawn
        </Text>
        <Text
          color="yellow"
          fontSize="1rem"
          fontWeight="bold"
          textAlign="center"
        >{`${tokenBalance?.formatted} ${tokenBalance?.symbol}`}</Text>
      </Stack>
      {/* {transaction && (
        <Text textAlign='center' fontSize='sm'>
          Follow your transaction{' '}
          <Link
            href={getTxLink(chainId, transaction.hash)}
            isExternal
            color='primary.300'
            textDecoration='underline'
          >
            here
          </Link>
        </Text>
      )} */}
      {isLoading && <Spinner size="xl" />}
      <Button
        onClick={withdrawFunds}
        isDisabled={!withdrawFunds}
        variant="solid"
        textTransform="uppercase"
      >
        Withdraw
      </Button>
    </Stack>
  );
}
