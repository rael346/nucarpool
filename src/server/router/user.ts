import { TRPCError } from "@trpc/server";
import { resolve } from "path";
import { z } from "zod";
import { createProtectedRouter } from "./createProtectedRouter";
import { Role } from "@prisma/client";
import { Status } from "@prisma/client";
import { Feature, FeatureCollection } from "geojson";

export const userRouter = createProtectedRouter()
  .query("me", {
    async resolve({ ctx }) {
      const id = ctx.session.user?.id;
      const user = await ctx.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          status: true,
          seatAvail: true,
          companyName: true,
          companyAddress: true,
          companyCoordLng: true,
          companyCoordLat: true,
          startLocation: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No profile with id '${id}'`,
        });
      }

      return user;
    },
  })
  .mutation("edit", {
    input: z.object({
      role: z.nativeEnum(Role),
      status: z.nativeEnum(Status),
      seatAvail: z.number().int().min(0),
      companyName: z.string().min(1),
      companyAddress: z.string().min(1),
      companyCoordLng: z.number(),
      companyCoordLat: z.number(),
      startLocation: z.string().min(1),
      isOnboarded: z.boolean(),
    }),
    async resolve({ ctx, input }) {
      const id = ctx.session.user?.id;
      const user = await ctx.prisma.user.update({
        where: { id },
        data: {
          role: input.role,
          status: input.status,
          seatAvail: input.seatAvail,
          companyName: input.companyName,
          companyAddress: input.companyAddress,
          companyCoordLng: input.companyCoordLng,
          companyCoordLat: input.companyCoordLat,
          startLocation: input.startLocation,
          isOnboarded: input.isOnboarded,
        },
      });

      return user;
    },
  })
  .query("geoJsonUsersList", {
    async resolve({ ctx }) {
      const id = ctx.session.user?.id;
      const users = await ctx.prisma.user.findMany({
        where: {
          id: {
            not: id, // doesn't include the current user
          },
          isOnboarded: true, // only include user that have finished onboarding
          status: Status.ACTIVE, // only include active users
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          status: true,
          seatAvail: true,
          companyName: true,
          companyAddress: true,
          companyCoordLng: true,
          companyCoordLat: true,
          startLocation: true,
        },
      });

      const features: Feature[] = users.map((u) => {
        const feat = {
          type: "Feature" as "Feature",
          geometry: {
            type: "Point" as "Point",
            coordinates: [u.companyCoordLng, u.companyCoordLat],
          },
          properties: {
            ...u,
          },
        };
        return feat;
      });

      const featureCollection: FeatureCollection = {
        type: "FeatureCollection" as "FeatureCollection",
        features,
      };

      return featureCollection;
    },
  });
