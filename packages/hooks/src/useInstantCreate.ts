import {
  LOG_TYPE,
  SMART_INVOICE_FACTORY_ABI,
  TOASTS,
  wrappedNativeToken,
} from '@smartinvoicexyz/constants';
import { waitForSubgraphSync } from '@smartinvoicexyz/graphql';
import { UseToastReturn } from '@smartinvoicexyz/types';
import {
  errorToastHandler,
  getInvoiceFactoryAddress,
  parseTxLogs,
} from '@smartinvoicexyz/utils';
import _ from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Address, encodeAbiParameters, Hex, parseUnits, toHex } from 'viem';
import { usePublicClient, useSimulateContract, useWriteContract } from 'wagmi';

import { useDetailsPin } from './useDetailsPin';
import { useFetchTokens } from './useFetchTokens';

export const useInstantCreate = ({
  invoiceForm,
  chainId,
  toast,
  onTxSuccess,
}: {
  invoiceForm: UseFormReturn;
  chainId: number;
  toast: UseToastReturn;
  onTxSuccess?: (result: Address) => void;
}): {
  waitingForTx: boolean;
  prepareError: Error | null;
  writeAsync: () => Promise<Hex | undefined>;
  writeError: Error | null;
  isLoading: boolean;
} => {
  const invoiceFactory = getInvoiceFactoryAddress(chainId);
  const [waitingForTx, setWaitingForTx] = useState(false);
  const { getValues } = invoiceForm;
  const invoiceValues = getValues();
  const {
    client,
    provider,
    token,
    projectName,
    projectDescription,
    projectAgreement,
    startDate,
    endDate,
    deadline,
    paymentDue,
    lateFee,
    lateFeeTimeInterval,
  } = _.pick(invoiceValues, [
    'client',
    'provider',
    'token',
    'projectName',
    'projectDescription',
    'projectAgreement',
    'startDate',
    'endDate',
    'deadline',
    'paymentDue',
    'lateFee',
    'lateFeeTimeInterval',
  ]);

  const detailsData = useMemo(
    () => ({
      projectName,
      projectDescription,
      projectAgreement: _.get(_.first(projectAgreement), 'src', ''),
      startDate,
      endDate,
    }),
    [projectName, projectDescription, projectAgreement, startDate, endDate],
  );

  const { data: tokens } = useFetchTokens();
  const tokenMetadata = _.filter(tokens, { address: token, chainId })[0];

  const { data: details } = useDetailsPin(detailsData);

  const paymentAmount = useMemo(() => {
    if (!tokenMetadata || !paymentDue) {
      return BigInt(0);
    }

    return parseUnits(_.toString(paymentDue), tokenMetadata.decimals);
  }, [tokenMetadata, paymentDue]);

  const escrowData = useMemo(() => {
    if (!client || !deadline || !wrappedNativeToken(chainId) || !details) {
      return '0x';
    }
    let lateFeeTimeIntervalSeconds = BigInt(0);
    if (lateFeeTimeInterval) {
      lateFeeTimeIntervalSeconds = BigInt(
        // days to milliseconds
        lateFeeTimeInterval * 24 * 60 * 60 * 1000,
      );
    }

    const encodedParams = encodeAbiParameters(
      [
        { type: 'address' }, //     _client,
        { type: 'address' }, //     _token,
        { type: 'uint256' }, //     _deadline, // exact time when late fee kicks in
        { type: 'bytes32' }, //     _details,
        { type: 'address' }, //     _wrappedNativeToken,
        { type: 'uint256' }, //     _lateFee,
        { type: 'uint256' }, //     _lateFeeTimeInterval
      ],
      [
        client,
        token, // address _token (payment token address)
        BigInt(new Date(deadline.toString()).getTime() / 1000), // deadline
        details, // bytes32 _details detailHash
        wrappedNativeToken(chainId),
        parseUnits(lateFee || '0', tokenMetadata?.decimals || 18), // late fee in payment token per interval
        lateFeeTimeIntervalSeconds, // late fee time interval convert from some days duration to seconds
      ],
    );

    return encodedParams;
  }, [
    client,
    token,
    tokenMetadata,
    deadline,
    details,
    wrappedNativeToken,
    lateFee,
    lateFeeTimeInterval,
  ]);

  const { data, error: prepareError } = useSimulateContract({
    address: invoiceFactory,
    chainId,
    abi: SMART_INVOICE_FACTORY_ABI,
    functionName: 'create',
    args: [
      provider,
      [paymentAmount],
      escrowData,
      toHex('instant', { size: 32 }),
    ],
    query: {
      enabled: !!invoiceFactory && !!chainId && !!provider && !!escrowData,
    },
  });

  const publicClient = usePublicClient();

  const {
    writeContractAsync,
    error: writeError,
    isPending: isLoading,
  } = useWriteContract({
    mutation: {
      onSuccess: async hash => {
        // wait for tx to confirm on chain
        setWaitingForTx(true);
        toast.info(TOASTS.useInvoiceCreate.waitingForTx);

        const txData = await publicClient?.waitForTransactionReceipt({
          hash,
        });

        if (!txData) return;

        // wait for subgraph to index
        const localInvoiceId = parseTxLogs(
          LOG_TYPE.Factory,
          txData,
          'LogNewInvoice',
          'invoice',
        );
        if (!localInvoiceId) return;
        toast.info(TOASTS.useInvoiceCreate.waitingForIndex);

        if (txData && publicClient) {
          await waitForSubgraphSync(publicClient.chain.id, txData.blockNumber);
        }
        setWaitingForTx(false);

        // pass back to component for further processing
        onTxSuccess?.(localInvoiceId);
      },
      onError: (error: Error) =>
        errorToastHandler('useInstantCreate', error, toast),
    },
  });

  const writeAsync = useCallback(async (): Promise<Hex | undefined> => {
    try {
      if (!data) {
        throw new Error('simulation data is not available');
      }
      return writeContractAsync(data.request);
    } catch (error) {
      errorToastHandler('useInstantCreate', error as Error, toast);
      return undefined;
    }
  }, [writeContractAsync, data]);

  return {
    waitingForTx,
    prepareError,
    writeAsync,
    writeError,
    isLoading,
  };
};
