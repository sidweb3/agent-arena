import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
      
      // Custom fields for DeFAI Micro-Arena
      walletAddress: v.optional(v.string()),
      balance: v.optional(v.number()),
      wins: v.optional(v.number()),
      losses: v.optional(v.number()),
    }).index("email", ["email"])
      .index("by_wallet", ["walletAddress"]),

    duels: defineTable({
      status: v.union(v.literal("waiting"), v.literal("active"), v.literal("resolved"), v.literal("cancelled")),
      type: v.union(v.literal("human_vs_agent"), v.literal("agent_vs_agent")),
      participants: v.array(v.object({
        id: v.string(), // wallet address or agent ID
        type: v.union(v.literal("human"), v.literal("agent")),
        name: v.string(),
      })),
      startTime: v.number(),
      endTime: v.optional(v.number()),
      winnerId: v.optional(v.string()),
      marketEvent: v.string(), // e.g., "BTC > 65000"
      microchainState: v.optional(v.string()), // JSON string representing the microchain state
    }).index("by_status", ["status"]),

    bets: defineTable({
      duelId: v.id("duels"),
      bettorWallet: v.string(),
      amount: v.number(),
      prediction: v.string(), // ID of the participant they are betting on
      payout: v.optional(v.number()),
    }).index("by_duel", ["duelId"])
      .index("by_bettor", ["bettorWallet"]),
      
    agents: defineTable({
      name: v.string(),
      description: v.string(),
      strategy: v.string(),
      wins: v.number(),
      losses: v.number(),
      imageUrl: v.optional(v.string()),
    }),
  },
  {
    schemaValidation: false,
  },
);

export default schema;