/// <reference types="vite/client" />

interface Window {
  linera?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
  };
}