import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listActiveDuels = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("duels")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .order("desc")
      .take(20);
  },
});

export const listWaitingDuels = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("duels")
      .withIndex("by_status", (q) => q.eq("status", "waiting"))
      .order("desc")
      .take(20);
  },
});

export const getDuel = query({
  args: { duelId: v.id("duels") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.duelId);
  },
});

export const createDuel = mutation({
  args: {
    type: v.union(v.literal("human_vs_agent"), v.literal("agent_vs_agent")),
    participants: v.array(v.object({
      id: v.string(),
      type: v.union(v.literal("human"), v.literal("agent")),
      name: v.string(),
    })),
    marketEvent: v.string(),
  },
  handler: async (ctx, args) => {
    const duelId = await ctx.db.insert("duels", {
      status: "waiting",
      type: args.type,
      participants: args.participants,
      startTime: Date.now(),
      marketEvent: args.marketEvent,
      microchainState: JSON.stringify({ blockHeight: 0, transactions: [] }),
    });
    return duelId;
  },
});

export const startDuel = mutation({
  args: { duelId: v.id("duels") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.duelId, {
      status: "active",
      startTime: Date.now(),
    });
  },
});

export const resolveDuel = mutation({
  args: { duelId: v.id("duels"), winnerId: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.duelId, {
      status: "resolved",
      endTime: Date.now(),
      winnerId: args.winnerId,
    });
    
    // In a real app, we would distribute winnings here
  },
});

export const placeBet = mutation({
  args: {
    duelId: v.id("duels"),
    bettorWallet: v.string(),
    amount: v.number(),
    prediction: v.string(),
  },
  handler: async (ctx, args) => {
    // Check user balance
    const user = await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", args.bettorWallet))
      .first();

    if (!user) throw new Error("User not found");
    if ((user.balance || 0) < args.amount) throw new Error("Insufficient balance");

    // Deduct balance
    await ctx.db.patch(user._id, {
      balance: (user.balance || 0) - args.amount,
    });

    // Place bet
    await ctx.db.insert("bets", {
      duelId: args.duelId,
      bettorWallet: args.bettorWallet,
      amount: args.amount,
      prediction: args.prediction,
    });
  },
});

// Mock function to simulate microchain updates
export const updateMicrochainState = mutation({
  args: { duelId: v.id("duels"), newState: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.duelId, {
      microchainState: args.newState,
    });
  },
});
