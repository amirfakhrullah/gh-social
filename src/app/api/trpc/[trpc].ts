import { type NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { env } from "@/env.mjs";
import { createContextInner } from "@/server/api/context";
import { appRouter } from "@/server/api/root";

function handler(req: NextRequest) {
  return fetchRequestHandler({
    req,
    endpoint: "/api/trpc",
    router: appRouter,
    createContext() {
      const auth = getAuth(req);
      return createContextInner({
        req,
        auth,
      });
    },
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  });
}

export { handler as GET, handler as POST };

export const runtime = "nodejs"