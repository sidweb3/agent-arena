import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut, Loader2, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { useLinera } from '@/contexts/LineraContext'

export function WalletConnect() {
  const { address, isConnected: isWagmiConnected } = useAccount()
  const { connect, connectors, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()
  
  // Linera hook
  const { 
    isConnected: isLineraConnected, 
    account: lineraAccount, 
    connect: connectLinera, 
    disconnect: disconnectLinera,
    isLoading: isLineraLoading 
  } = useLinera()

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Failed to connect wallet')
    }
  }, [error])

  const handleConnect = async () => {
    try {
      // Try injected connector first (MetaMask, etc.)
      const injectedConnector = connectors.find(c => c.type === 'injected')
      if (injectedConnector) {
        connect({ connector: injectedConnector })
      } else {
        // Fallback to first available connector
        const connector = connectors[0]
        if (connector) {
          connect({ connector })
        } else {
          toast.error('No wallet connector available')
        }
      }
    } catch (error) {
      toast.error('Failed to connect wallet')
      console.error(error)
    }
  }

  const handleDisconnect = () => {
    if (isWagmiConnected) disconnect()
    if (isLineraConnected) disconnectLinera()
    toast.success('Wallet disconnected')
  }

  const handleLineraConnect = async () => {
    try {
      await connectLinera()
      toast.success('Connected to Linera')
    } catch (e) {
      toast.error('Failed to connect to Linera')
    }
  }

  // Wrap in a stable div to prevent removeChild errors during state transitions
  return (
    <div className="relative">
      {((isWagmiConnected && address) || (isLineraConnected && lineraAccount)) ? (
        <div
          className="flex items-center gap-2"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-sm font-mono">
            <span className="text-xs text-muted-foreground uppercase">{isLineraConnected ? 'Linera' : 'EVM'}</span>
            <span className="w-px h-3 bg-primary/20" />
            {(isLineraConnected ? lineraAccount : address)?.slice(0, 6)}...{(isLineraConnected ? lineraAccount : address)?.slice(-4)}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDisconnect}
            className="border-destructive/50 hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            onClick={handleLineraConnect}
            disabled={isLineraLoading}
            className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {isLineraLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Zap className="mr-2 h-4 w-4" />
            )}
            Connect Linera
          </Button>
          
          <Button
            onClick={handleConnect}
            disabled={isPending}
            variant="outline"
            className="border-primary/50 hover:bg-primary/10"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="mr-2 h-4 w-4" />
            )}
            Connect EVM
          </Button>
        </div>
      )}
    </div>
  )
}