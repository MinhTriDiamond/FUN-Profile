import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, bsc } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'FUN Profile',
  projectId: 'a7b841b8f0a6b6738697eb77e8962df8',
  chains: [mainnet, bsc],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
  },
  ssr: false,
});
