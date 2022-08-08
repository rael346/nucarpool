import superjson from "superjson";
import { createRouter } from "./createRouter";
import { userRouter } from "./user";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("user.", userRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
