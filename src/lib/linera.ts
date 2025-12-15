// Configuration and helper functions for Linera integration
// This file will contain the core logic for interacting with the Linera SDK

// Default App ID for the Agent Arena contract (Testnet 0.15.7 compatible)
export const LINERA_APP_ID = import.meta.env.VITE_LINERA_APP_ID || "e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a6501360434d5a27b1b353fa994d152ee571263558e9d818457a4752d18d3d4477600";

export const LINERA_CONFIG = {
  network: import.meta.env.VITE_LINERA_NETWORK || 'testnet',
  nodeUrl: import.meta.env.VITE_LINERA_NODE_URL || 'http://localhost:8080',
  faucetUrl: import.meta.env.VITE_LINERA_FAUCET_URL,
};

/**
 * Validates if a string is a potential Linera address
 * @param address The address string to check
 * @returns true if valid format
 */
export function isValidLineraAddress(address: string): boolean {
  // Basic validation: starts with linera: or is a hex string of sufficient length
  // Adjust based on actual Linera address format
  return address.startsWith('linera:') || (address.length > 10 && !address.includes(' '));
}

/**
 * Executes a mutation operation on a Linera application
 * @param applicationId The ID of the application to interact with
 * @param operation The operation payload (usually a JSON object or string)
 * @returns The result of the execution
 */
export async function executeContract(applicationId: string, operation: any) {
  console.log("Executing contract:", applicationId, operation);
  
  if (!window.linera) {
    // Realistic Mock Execution
    console.log("Mocking contract execution on simulated network...");
    
    // Simulate network latency (1-2 seconds)
    const delay = 1000 + Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Return a realistic transaction receipt
    return {
      status: "executed",
      height: Math.floor(100000 + Math.random() * 50000),
      transactionHash: "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      effects: [],
      mock: true
    };
  }

  // Construct the GraphQL mutation for the Linera node/wallet
  // Note: The actual mutation structure depends on the specific Linera GraphQL API version
  const mutation = `
    mutation ExecuteOperation($applicationId: String!, $operation: String!) {
      executeOperation(applicationId: $applicationId, operation: $operation)
    }
  `;

  try {
    // Request the wallet to execute the operation
    // We use 'linera_graphqlMutation' as the method, which is standard for some Linera wallets
    // If the wallet uses a different standard, this might need adjustment
    const result = await window.linera.request({
      method: 'linera_graphqlMutation',
      params: {
        query: mutation,
        variables: {
          applicationId,
          operation: typeof operation === 'string' ? operation : JSON.stringify(operation)
        }
      }
    });
    
    return result;
  } catch (error) {
    console.error("Contract execution failed:", error);
    throw error;
  }
}

/**
 * Queries a Linera application state
 * @param applicationId The ID of the application to query
 * @param query The GraphQL query string
 * @returns The query result
 */
export async function queryContract(applicationId: string, query: string) {
  console.log("Querying contract:", applicationId, query);

  // Try using the wallet first if available
  if (window.linera) {
    try {
      return await window.linera.request({
        method: 'linera_graphqlQuery',
        params: {
          query,
          variables: { applicationId }
        }
      });
    } catch (e) {
      console.warn("Wallet query failed, falling back to HTTP node", e);
    }
  }

  // Mock query response if no wallet/node available
  if (!window.linera && LINERA_CONFIG.nodeUrl.includes("localhost")) {
     console.log("Returning mock query response");
     return {
       data: {
         value: "Mock State"
       }
     };
  }

  // Fallback to direct HTTP request to the node
  try {
    const response = await fetch(LINERA_CONFIG.nodeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query,
        variables: { applicationId }
      })
    });
    
    const json = await response.json();
    if (json.errors) {
      throw new Error(json.errors[0].message);
    }
    return json.data;
  } catch (error) {
    console.error("Contract query failed:", error);
    throw error;
  }
}