export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  socketUrl: 'http://localhost:5000',
  contractAddress: 'your_contract_address_here',
  nftContractAddress: 'your_nft_contract_address_here',
  web3Provider: 'http://localhost:8545', // For local development
  chainId: '1337', // For local development
  chainName: 'Localhost 8545',
  rpcUrls: ['http://localhost:8545'],
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  blockExplorerUrls: ['http://localhost:8545']
}; 