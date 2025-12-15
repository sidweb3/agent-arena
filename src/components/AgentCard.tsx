import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Target } from 'lucide-react'
import type { Doc } from '@/convex/_generated/dataModel'

interface AgentCardProps {
  agent: Doc<'agents'>
  onClick?: () => void
}

export function AgentCard({ agent, onClick }: AgentCardProps) {
  const winRate = agent.wins + agent.losses > 0 
    ? ((agent.wins / (agent.wins + agent.losses)) * 100).toFixed(1)
    : '0.0'

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card 
        className="cursor-pointer border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,136,0.2)] bg-card/50 backdrop-blur-sm"
        onClick={onClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img
                src={agent.imageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.name}`}
                alt={agent.name}
                className="w-12 h-12 rounded-lg border border-primary/20"
              />
              <div>
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <CardDescription className="text-xs">{agent.description}</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-primary/30 text-primary">
              {winRate}% WR
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">{agent.strategy}</p>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1 text-primary">
              <Trophy className="h-3 w-3" />
              <span>{agent.wins} wins</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Target className="h-3 w-3" />
              <span>{agent.losses} losses</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
