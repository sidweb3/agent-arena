import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "sonner";

// Interface for the Linera Context
interface LineraContextType {
  isConnected: boolean;
  account: string | null;
  chainId: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isLoading: boolean;
  error: string | null;
  isMock: boolean;
}

const LineraContext = createContext<LineraContextType | undefined>(undefined);

export function LineraProvider({ children }: { children: ReactNode }) {
  // Add debug log
  React.useEffect(() => {
    console.log("LineraProvider mounted");
  }, []);

  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);

  const connect = async () => {
    setIsLoading(true);
    setError(null);
    setIsMock(false);
    try {
      console.log("Initializing Linera connection...");
      
      // Check for injected Linera provider
      if (typeof window !== 'undefined' && (window as any).linera) {
        const provider = (window as any).linera;
        console.log("Found Linera provider");
        
        let accounts;
        try {
          // Try standard request first
          accounts = await provider.request({ method: 'eth_requestAccounts' });
        } catch (e) {
          console.log("eth_requestAccounts failed, trying linera_accounts");
          try {
             // Fallback to specific linera method if exists
             accounts = await provider.request({ method: 'linera_accounts' });
          } catch (e2) {
             console.error("Failed to request accounts", e2);
             // Don't throw yet, might be a different API
          }
        }

        if (accounts && accounts.length > 0) {
           setAccount(accounts[0]);
           setChainId("linera-mainnet"); // or fetch from provider
           setIsConnected(true);
           setIsMock(false);
           return;
        }
      }

      // If we get here, no provider was found.
      // Fallback to Realistic Mock Mode
      console.log("Linera wallet not found. Enabling realistic mock mode.");
      
      // Simulate connection delay for realism
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate a realistic looking Linera address
      const mockAddress = "linera:" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('').slice(0, 40);
      
      setAccount(mockAddress);
      setChainId("linera-testnet-mock");
      setIsConnected(true);
      setIsMock(true);
      toast.info("Connected to Linera (Simulated Network)");
      
    } catch (err) {
      console.error("Failed to connect to Linera:", err);
      setError(err instanceof Error ? err.message : "Failed to connect to Linera wallet");
      setIsConnected(false);
      setIsMock(false);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
    setIsMock(false);
  };

  return (
    <LineraContext.Provider value={{ isConnected, account, chainId, connect, disconnect, isLoading, error, isMock }}>
      {children}
    </LineraContext.Provider>
  );
}

export function useLinera() {
  const context = useContext(LineraContext);
  if (context === undefined) {
    // Fallback to prevent crashes if used outside provider
    console.warn('useLinera used outside LineraProvider - returning fallback');
    return {
      isConnected: false,
      account: null,
      chainId: null,
      connect: async () => {},
      disconnect: () => {},
      isLoading: false,
      error: 'Context not found',
      isMock: false
    };
  }
  return context;
}