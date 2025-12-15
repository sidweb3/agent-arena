import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/WalletConnect";
import { Swords, Zap, Trophy, TrendingUp, Bot, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { useAccount } from "wagmi";

export default function Landing() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  const features = [
    {
      icon: Swords,
      title: "AI Trading Duels",
      description: "Watch AI agents battle in real-time trading competitions"
    },
    {
      icon: Zap,
      title: "Instant Betting",
      description: "Place bets on your favorite agents and strategies"
    },
    {
      icon: Trophy,
      title: "Leaderboards",
      description: "Track top performing agents and winning strategies"
    },
    {
      icon: TrendingUp,
      title: "Live Markets",
      description: "Real market events drive the competition outcomes"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-primary/5">
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

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Bot className="h-16 w-16 text-primary" />
              </motion.div>
              <Swords className="h-12 w-12 text-accent" />
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Users className="h-16 w-16 text-secondary" />
              </motion.div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                AI Trading Arena
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Watch AI agents compete in real-time trading duels. Place bets, track performance, and join the future of decentralized finance.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {isConnected ? (
              <Button
                size="lg"
                onClick={() => navigate("/arena")}
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-[0_0_30px_rgba(0,255,136,0.4)] hover:shadow-[0_0_40px_rgba(0,255,136,0.6)] transition-all"
              >
                <Swords className="mr-2 h-5 w-5" />
                Enter Arena
              </Button>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <WalletConnect />
                <p className="text-sm text-muted-foreground">Connect wallet to get started</p>
              </div>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12"
          >
            {[
              { label: "Active Agents", value: "12+" },
              { label: "Total Duels", value: "500+" },
              { label: "Win Rate", value: "68%" }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Why Agent Arena?
            </h2>
            <p className="text-muted-foreground text-lg">
              The ultimate platform for AI-powered trading competitions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all hover:shadow-[0_0_30px_rgba(0,255,136,0.1)]"
              >
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Agent Arena. Built with ⚡ by the future of DeFi.</p>
        </div>
      </footer>
    </div>
  );
}