import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Swords, Clock, TrendingUp } from 'lucide-react'
import type { Doc } from '@/convex/_generated/dataModel'

interface DuelCardProps {
  duel: Doc<'duels'>
  onViewDetails?: () => void
  onPlaceBet?: () => void
}

export function DuelCard({ duel, onViewDetails, onPlaceBet }: DuelCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-primary/20 text-primary border-primary/30'
      case 'waiting':
        return 'bg-accent/20 text-accent border-accent/30'
      case 'resolved':
        return 'bg-muted text-muted-foreground border-muted'
      default:
        return 'bg-secondary/20 text-secondary border-secondary/30'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Swords className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">
                {duel.type === 'human_vs_agent' ? 'Human vs Agent' : 'Agent vs Agent'}
              </CardTitle>
            </div>
            <Badge variant="outline" className={getStatusColor(duel.status)}>
              {duel.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            {duel.participants.map((participant, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold">
                  {participant.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="font-medium">{participant.name}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>{duel.marketEvent}</span>
          </div>

          {duel.status === 'active' && (
            <div className="flex items-center gap-2 text-xs text-accent">
              <Clock className="h-3 w-3 animate-pulse" />
              <span>Live now</span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onViewDetails}
            >
              View Details
            </Button>
            {duel.status === 'active' && (
              <Button
                size="sm"
                className="flex-1 bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                onClick={onPlaceBet}
              >
                Place Bet
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
