import React from 'react';

import { Badge } from '@chakra-ui/react';

export type InvoiceBadgeProps = {
  invoiceType?: 'escrow' | 'instant' | 'unknown';
};

export const InvoiceBadge: React.FC<InvoiceBadgeProps> = ({ invoiceType = 'unknown' }) => {
  const schemes = {
    escrow: {
      bg: 'rgba(128, 63, 248, 0.3)',
      color: 'rgba(128, 63, 248, 1)',
    },
    instant: {
      bg: 'rgba(248, 174, 63, 0.3)',
      color: 'rgba(248, 174, 63, 1)',
    },
    unknown: {
      bg: 'rgba(150,150,150,0.3)',
      color: 'rgba(150,150,150,1)',
    },
  };

  return (
    <Badge
      backgroundColor={schemes[invoiceType].bg}
      color={schemes[invoiceType].color}
      maxW="fit-content"
      height="fit-content"
    >
      {invoiceType.toUpperCase()}
    </Badge>
  );
};
