import { createConfig, http } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [bscTestnet],
  connectors: [
    injected(),
    metaMask(),
  ],
  transports: {
    [bscTestnet.id]: http(),
  },
});
