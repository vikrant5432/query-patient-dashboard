import { usePGlite } from "@electric-sql/pglite-react";
import { useEffect } from "react";
import { initDbSchema } from "../database/schema";

export const useInitDB = () => {
  const db = usePGlite();
  useEffect(() => {
    const init = async () => {
      await initDbSchema(db);
    };

    init();
  }, [db]);

  return db;
};
