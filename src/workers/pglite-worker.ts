import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { worker } from "@electric-sql/pglite/worker";

// Part 4: Support usage in multiple browser tabs simultaneously.

worker({
  async init() {
    return new PGlite("idb://medblock-db", {
      extensions: { live },
    });
  },
});
