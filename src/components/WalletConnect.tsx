import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const handleConnect = async () => {
    try {
      const connector = connectors[0]
      if (connector) {
        connect({ connector })
      }
    } catch (error) {
      toast.error('Failed to connect wallet')
      console.error(error)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    toast.success('Wallet disconnected')
  }

  if (isConnected && address) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2"
      >
        <div className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-sm font-mono">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleDisconnect}
          className="border-destructive/50 hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </motion.div>
    )
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isPending}
      className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(0,255,136,0.3)]"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isPending ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  )
}
