import React, { createContext, useContext, useState, ReactNode } from 'react';

// Interface for the Linera Context
interface LineraContextType {
  isConnected: boolean;
  account: string | null;
  chainId: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isLoading: boolean;
  error: string | null;
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

  const connect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Placeholder for actual Linera connection logic
      // We will need to replace this with the actual @linera/web.js implementation
      // once we have the specific API details or documentation.
      console.log("Initializing Linera connection...");
      
      // TODO: Integrate @linera/web.js Client here
      // const client = new Client(...);
      
      // Simulating connection for UI feedback
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for now
      const mockAccount = "linera:" + Math.random().toString(36).substring(7);
      setAccount(mockAccount);
      setChainId("linera-testnet");
      setIsConnected(true);
      
    } catch (err) {
      console.error("Failed to connect to Linera:", err);
      setError(err instanceof Error ? err.message : "Failed to connect to Linera wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
  };

  return (
    <LineraContext.Provider value={{ isConnected, account, chainId, connect, disconnect, isLoading, error }}>
      {children}
    </LineraContext.Provider>
  );
}

export function useLinera() {
  const context = useContext(LineraContext);
  if (context === undefined) {
    throw new Error('useLinera must be used within a LineraProvider');
  }
  return context;
}