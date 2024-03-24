import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { Poll, PollOption, PollVote } from "~/server/types";

export const pollRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        expiry: z.date().optional(),
        noExpiry: z.boolean().default(false),
        options: z
          .array(
            z.object({
              option: z.string().min(1),
            }),
          )
          .nonempty(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const poll = (await ctx.db.poll.create({
        data: {
          name: input.name,
          expiry: input.expiry ?? undefined,
          neverExpire: input.noExpiry,
          createdBy: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          expired: false,
        },
      })) as Poll;

      for (const option of input.options) {
        await ctx.db.pollOption.create({
          data: {
            name: option.option,
            poll: {
              connect: {
                id: poll.id,
              },
            },
          },
        });
      }

      return poll;
    }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return (await ctx.db.poll.findFirst({
        where: { id: input.id },
        include: {
          options: {
            select: { name: true, id: true, pollVotes: true },
          },
          pollVotes: {
            select: { userId: true },
          },
        },
      })) as Poll;
    }),

  vote: protectedProcedure
    .input(z.object({ id: z.string(), optionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const vote = (await ctx.db.pollVote.findUnique({
        where: {
          pollId_userId: {
            pollId: input.id,
            userId: ctx.session.user.id,
          },
        },
      })) as PollVote;

      if (vote)
        throw new TRPCError({ code: "BAD_REQUEST", message: "Already voted" });

      return (await ctx.db.pollVote.create({
        data: {
          poll: {
            connect: {
              id: input.id,
            },
          },
          option: {
            connect: {
              id: input.optionId,
            },
          },
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
        include: {
          option: {
            select: { name: true, id: true, pollVotes: true },
          },
        },
      })) as PollVote;
    }),

  alreadyVoted: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const vote = (await ctx.db.pollVote.findUnique({
        where: {
          pollId_userId: {
            pollId: input.id,
            userId: ctx.session.user.id,
          },
        },
        include: {
          option: {
            select: { name: true, id: true, pollVotes: true },
          },
        },
      })) as PollVote;

      if (!vote)
        return {
          alreadyVoted: false,
          option: null,
        };
      return {
        alreadyVoted: true,
        option: vote.option,
      };
    }),

  getUserPolls: protectedProcedure
    .input(
      z.object({
        sortByData: z.string().default("desc"),
        text: z.string().default(""),
      }),
    )
    .query(async ({ ctx, input }) => {
      return (await ctx.db.poll.findMany({
        where: {
          name: {
            contains: input.text,
            mode: "insensitive",
          },
          createdBy: {
            id: ctx.session.user.id,
          },
        },
        orderBy: {
          createdAt: input.sortByData === "newest" ? "desc" : "asc",
        },
        include: {
          pollVotes: true,
        },
      })) as Poll[];
    }),
});
