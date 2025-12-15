import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useLinera } from '@/contexts/LineraContext';

export function WalletSync() {
  const { address, isConnected: isWagmiConnected } = useAccount();
  
  // Safely access Linera context
  let lineraAccount = null;
  let isLineraConnected = false;
  
  try {
    const linera = useLinera();
    lineraAccount = linera.account;
    isLineraConnected = linera.isConnected;
  } catch (e) {
    console.error("WalletSync: Failed to get Linera context", e);
  }

  const storeUser = useMutation(api.users.storeUser);

  useEffect(() => {
    if (isWagmiConnected && address) {
      storeUser({
        walletAddress: address,
        name: `User ${address.slice(0, 6)}`,
      }).catch(console.error);
    } else if (isLineraConnected && lineraAccount) {
      storeUser({
        walletAddress: lineraAccount,
        name: `Linera User ${lineraAccount.slice(0, 6)}`,
      }).catch(console.error);
    }
  }, [isWagmiConnected, address, isLineraConnected, lineraAccount, storeUser]);

  return null;
}