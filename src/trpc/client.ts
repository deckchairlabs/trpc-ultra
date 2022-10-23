import { httpBatchLink } from "@trpc/client";
import { trpc } from "../trpc/trpc.ts";

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
});
