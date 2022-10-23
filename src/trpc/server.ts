import { TRPCLink } from "@trpc/client";
import { observable } from "@trpc/server/observable";
import { AppRouter, appRouter } from "../server/router.ts";
import { trpc } from "../trpc/trpc.ts";

const customLink: TRPCLink<AppRouter> = () => {
  return ({ op }) => {
    const caller = appRouter.createCaller(op.context);

    return observable((observer) => {
      // @ts-ignore would need a better way of calling since this is deprecated
      const promise = caller.query(op.path, op.input);

      promise.then((data) => {
        observer.next({ result: { data } });
        observer.complete();
      }).catch((error) => {
        observer.error(error);
      });
    });
  };
};

export const trpcClient = trpc.createClient({
  links: [customLink],
});
