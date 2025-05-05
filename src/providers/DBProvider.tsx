import { useEffect, useState } from "react";
import { PGliteWorker } from "@electric-sql/pglite/worker";
import { PGliteProvider } from "@electric-sql/pglite-react";
import { live, LiveNamespace } from "@electric-sql/pglite/live";

export const DBProvider = ({ children }: { children: React.ReactNode }) => {
  const [db, setDb] = useState<
    PGliteWorker & {
      live: LiveNamespace;
    }
  >();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDbInitialize = async () => {
      try {
        // Create PGliteWorker with the worker file
        const pgliteWorker = await PGliteWorker.create(
          new Worker(new URL("../workers/pglite-worker.ts", import.meta.url), {
            type: "module",
          }),
          {
            dataDir: "idb://medblock-db",
            extensions: { live },
            id: "medblock-worker",
          }
        );

        setDb(pgliteWorker);
      } catch (error) {
        console.error("Failed to initialize database:", error);
      } finally {
        setLoading(false);
      }
    };

    initDbInitialize();
  }, []);

  if (loading) {
    return <div>Loading database...</div>; // or a loading spinner
  }

  if (!db) {
    return <div>Failed to load database</div>;
  }

  return <PGliteProvider db={db}>{children}</PGliteProvider>;
};
