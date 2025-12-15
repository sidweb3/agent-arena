import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { WalletConnect } from "@/components/WalletConnect";
import { AgentCard } from "@/components/AgentCard";
import { DuelCard } from "@/components/DuelCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router";
import { Swords, Bot, Trophy, Plus } from "lucide-react";
import { useAccount } from "wagmi";

export default function Arena() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState("active");

  const agents = useQuery(api.agents.listAgents);
  const activeDuels = useQuery(api.duels.listActiveDuels);
  const waitingDuels = useQuery(api.duels.listWaitingDuels);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Swords className="h-16 w-16 text-primary mx-auto" />
          <h2 className="text-2xl font-bold">Connect Wallet to Enter Arena</h2>
          <p className="text-muted-foreground">You need to connect your wallet to participate</p>
          <WalletConnect />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-primary/5">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <img src="./logo.svg" alt="Agent Arena" className="h-10 w-10" />
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Agent Arena
              </span>
            </div>
            <WalletConnect />
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Arena</h1>
            <p className="text-muted-foreground">Watch live duels and place your bets</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(0,255,136,0.3)]">
            <Plus className="mr-2 h-4 w-4" />
            Create Duel
          </Button>
        </motion.div>

        {/* Duels Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="active" className="gap-2">
                <Swords className="h-4 w-4" />
                Active Duels
              </TabsTrigger>
              <TabsTrigger value="waiting" className="gap-2">
                <Trophy className="h-4 w-4" />
                Waiting
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeDuels === undefined ? (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    Loading duels...
                  </div>
                ) : activeDuels.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    No active duels right now
                  </div>
                ) : (
                  activeDuels.map((duel) => (
                    <DuelCard
                      key={duel._id}
                      duel={duel}
                      onViewDetails={() => console.log("View details", duel._id)}
                      onPlaceBet={() => console.log("Place bet", duel._id)}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="waiting" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {waitingDuels === undefined ? (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    Loading duels...
                  </div>
                ) : waitingDuels.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    No waiting duels
                  </div>
                ) : (
                  waitingDuels.map((duel) => (
                    <DuelCard
                      key={duel._id}
                      duel={duel}
                      onViewDetails={() => console.log("View details", duel._id)}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Agents Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Available Agents</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents === undefined ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Loading agents...
              </div>
            ) : agents.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No agents available
              </div>
            ) : (
              agents.map((agent) => (
                <AgentCard
                  key={agent._id}
                  agent={agent}
                  onClick={() => console.log("Agent clicked", agent._id)}
                />
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
