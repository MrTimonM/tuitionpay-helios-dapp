export const HELIOS_TESTNET = {
  chainId: '0xa410', // 42000 in hex
  chainName: 'Helios Testnet',
  nativeCurrency: {
    name: 'tHELIOS',
    symbol: 'tHELIOS',
    decimals: 18
  },
  rpcUrls: ['https://testnet1.helioschainlabs.org'],
  blockExplorerUrls: ['https://explorer.helioschainlabs.org']
};

export const MOCK_INSTITUTIONS = [
  {
    id: 'harvard',
    name: 'Harvard University',
    address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C8C',
    departments: [
      { id: 'cs', name: 'Computer Science', tuitionFee: '50.0' },
      { id: 'business', name: 'Business Administration', tuitionFee: '45.0' },
      { id: 'medicine', name: 'Medicine', tuitionFee: '60.0' },
      { id: 'law', name: 'Law', tuitionFee: '55.0' }
    ]
  },
  {
    id: 'mit',
    name: 'MIT',
    address: '0x8ba1f109551bD432803012645Hac136c9c1495bF',
    departments: [
      { id: 'engineering', name: 'Engineering', tuitionFee: '52.0' },
      { id: 'physics', name: 'Physics', tuitionFee: '48.0' },
      { id: 'mathematics', name: 'Mathematics', tuitionFee: '46.0' }
    ]
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    departments: [
      { id: 'ai', name: 'Artificial Intelligence', tuitionFee: '58.0' },
      { id: 'biotech', name: 'Biotechnology', tuitionFee: '54.0' },
      { id: 'economics', name: 'Economics', tuitionFee: '47.0' }
    ]
  }
];

export const FAUCET_URL = 'https://faucet.helioschainlabs.org';