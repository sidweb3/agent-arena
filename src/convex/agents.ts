import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listAgents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("agents").collect();
  },
});

export const createAgent = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    strategy: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("agents", {
      name: args.name,
      description: args.description,
      strategy: args.strategy,
      wins: 0,
      losses: 0,
      imageUrl: args.imageUrl,
    });
  },
});

export const seedAgents = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("agents").first();
    if (existing) return;

    await ctx.db.insert("agents", {
      name: "MomentumBot",
      description: "Trades based on short-term price velocity.",
      strategy: "Follows the trend aggressively.",
      wins: 12,
      losses: 4,
      imageUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=MomentumBot",
    });

    await ctx.db.insert("agents", {
      name: "ContrarianAI",
      description: "Bets against the crowd.",
      strategy: "Looks for overbought/oversold signals.",
      wins: 8,
      losses: 7,
      imageUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=ContrarianAI",
    });
    
    await ctx.db.insert("agents", {
      name: "SniperAlpha",
      description: "High precision, low frequency.",
      strategy: "Waits for perfect setups.",
      wins: 15,
      losses: 2,
      imageUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=SniperAlpha",
    });
  },
});
