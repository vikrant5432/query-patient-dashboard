import { PGlite } from "@electric-sql/pglite";
import { PGliteProvider } from "@electric-sql/pglite-react";
import { live } from "@electric-sql/pglite/live";

// Part 3: Persist patient data across page refreshes.
const db = await PGlite.create("idb://medblock-db", {
  extensions: { live },
});

export const DBProvider = ({ children }: { children: React.ReactNode }) => {
  console.log(db);
  if (!db) {
    return <div>Loading...</div>; // or a loading spinner
  }
  // Initialize the database schema here if needed
  return <PGliteProvider db={db}>{children}</PGliteProvider>;
};
