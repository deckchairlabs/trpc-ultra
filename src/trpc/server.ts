import { TRPCLink } from "@trpc/client";
import { observable } from "@trpc/server/observable";
import { AppRouter, appRouter } from "../server/router.ts";
import { trpc } from "../trpc/trpc.ts";

const customLink: TRPCLink<AppRouter> = () => {
  return ({ op }) => {
    const caller = appRouter.createCaller(op.context);

    return observable((observer) => {
      // @ts-ignore whatever
      const promise = caller.query(op.path, op.input, { context: op.context });

      promise.then((data) => {
        observer.next({ result: { data } });
        observer.complete();
      });
    });
  };
};

export const trpcClient = trpc.createClient({
  links: [customLink],
});
