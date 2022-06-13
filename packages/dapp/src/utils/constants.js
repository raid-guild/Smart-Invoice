import { CONFIG } from '../config';

const { INFURA_ID, IPFS_ENDPOINT, BOX_ENDPOINT, NETWORK_CONFIG } = CONFIG;

export { INFURA_ID, IPFS_ENDPOINT, BOX_ENDPOINT };

export const chainIds = {
  xdai: 100,
  mainnet: 1,
  rinkeby: 4,
  kovan: 42,
  hardhat: 31337,
};

export const hexChainIds = {
  xdai: '0x64',
  mainnet: '0x01',
  rinkeby: '0x04',
  kovan: '0x2a',
  hardhat: '0x7a69',
};

export const networkLabels = {
  100: 'xDai',
  1: 'Ethereum',
  3: 'Ropsten',
  4: 'Rinkeby',
  5: 'Görli',
  42: 'Kovan',
  56: 'BSC',
  77: 'Sokol',
  137: 'Matic',
  31337: 'Hardhat',
};

export const networkNames = {
  1: 'ETH Mainnet',
  4: 'Rinkeby Testnet',
  42: 'Kovan Testnet',
  100: 'xDai Chain',
  31337: 'Hardhat Network',
};

export const rpcUrls = {
  1: `https://mainnet.infura.io/v3/${INFURA_ID}`,
  4: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
  42: `https://kovan.infura.io/v3/${INFURA_ID}`,
  100: 'https://rpc.xdaichain.com',
  31337: 'http://localhost:8545',
};

export const explorerUrls = {
  1: 'https://etherscan.io',
  4: 'https://rinkeby.etherscan.io',
  42: 'https://kovan.etherscan.io',
  100: 'https://blockscout.com/poa/xdai',
  31337: 'placeholder',
};

export const nativeSymbols = {
  1: 'ETH',
  4: 'ETH',
  42: 'ETH',
  100: 'XDAI',
  31337: 'hhETH',
};
// https://api.thegraph.com/subgraphs/name/psparacino/smart-invoices-rinkey-ps
export const graphUrls = {
  1: `https://api.thegraph.com/subgraphs/name/${NETWORK_CONFIG[1].SUBGRAPH}`,
  // 4: `https://api.thegraph.com/subgraphs/name/${NETWORK_CONFIG[4].SUBGRAPH}`,
  4: 'https://api.thegraph.com/subgraphs/name/psparacino/smart-invoices-rinkey-ps',
  100: `https://api.thegraph.com/subgraphs/name/${NETWORK_CONFIG[100].SUBGRAPH}`,
  31337: 'http://localhost:8000/subgraphs/name/test/smart-invoices',
};

// Build completed: QmPJ3hcLh6E5ZJcsBk4NoCtb18eRFhG6S2usAuykMXqoFD

// Deployed to http://localhost:8000/subgraphs/name/test/smart-invoices/graphql

export const tokens = {
  1: Object.keys(NETWORK_CONFIG[1].TOKENS),
  4: Object.keys(NETWORK_CONFIG[4].TOKENS),
  100: Object.keys(NETWORK_CONFIG[100].TOKENS),
  31337: Object.keys(NETWORK_CONFIG[1].TOKENS),
};

export const tokenInfo = {
  1: NETWORK_CONFIG[1].TOKENS,
  4: NETWORK_CONFIG[4].TOKENS,
  100: NETWORK_CONFIG[100].TOKENS,
  31337: Object.keys(NETWORK_CONFIG[1].TOKENS),
};

export const resolvers = {
  1: Object.keys(NETWORK_CONFIG[1].RESOLVERS),
  4: Object.keys(NETWORK_CONFIG[4].RESOLVERS),
  100: Object.keys(NETWORK_CONFIG[100].RESOLVERS),
  31337: Object.keys(NETWORK_CONFIG[1].RESOLVERS),
};

export const resolverInfo = {
  1: NETWORK_CONFIG[1].RESOLVERS,
  4: NETWORK_CONFIG[4].RESOLVERS,
  100: NETWORK_CONFIG[100].RESOLVERS,
  31337: NETWORK_CONFIG[1].RESOLVERS,
};

export const wrappedNativeToken = {
  1: NETWORK_CONFIG[1].WRAPPED_NATIVE_TOKEN,
  4: NETWORK_CONFIG[4].WRAPPED_NATIVE_TOKEN,
  100: NETWORK_CONFIG[100].WRAPPED_NATIVE_TOKEN,
  31337: NETWORK_CONFIG[1].WRAPPED_NATIVE_TOKEN,
};

export const invoiceFactory = {
  1: NETWORK_CONFIG[1].INVOICE_FACTORY,
  4: NETWORK_CONFIG[4].INVOICE_FACTORY,
  100: NETWORK_CONFIG[100].INVOICE_FACTORY,
  31337: NETWORK_CONFIG[31337].INVOICE_FACTORY,
};

export const SUPPORTED_NETWORKS = Object.keys(NETWORK_CONFIG).map(n =>
  Number(n),
);

export const INVOICE_VERSION = 'smart-invoice-v0';

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

export const STEPS = {
  1: {
    step_title: 'Project Details',
    step_details: [
      'Note: All invoice data will be stored publicly on IPFS and can be viewed by anyone.',
      'If you have privacy concerns, we recommend taking care to add permissions to your project agreement document.',
    ],
    next: 'payment details',
  },
  2: {
    step_title: 'Payment Details',
    step_details: [],
    next: 'set payment amounts',
  },
  3: {
    step_title: 'Payment Chunks',
    step_details: [],
    next: 'confirmation',
  },
  4: {
    step_title: 'Confirmation',
    step_details: [],
    next: 'create invoice',
  },
};
