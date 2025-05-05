import { PGlite } from "@electric-sql/pglite";
import { vector } from "@electric-sql/pglite/vector";
import { worker } from "@electric-sql/pglite/worker";

// Part 4: Support usage in multiple browser tabs simultaneously.

worker({
  async init(options) {
    return new PGlite({
      dataDir: options.dataDir,
      extensions: {
        vector,
      },
    });
  },
});
