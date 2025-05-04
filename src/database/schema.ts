import { PGliteInterface } from "@electric-sql/pglite";

export const initDbSchema = async (db: PGliteInterface) => {
  try {
    await db.exec(`
              CREATE TABLE IF NOT EXISTS doctors (
                  id SERIAL PRIMARY KEY,
                  name TEXT NOT NULL,
                  specialty TEXT NOT NULL,
                  email TEXT NOT NULL UNIQUE,
                  password TEXT NOT NULL);
                              
                  CREATE TABLE IF NOT EXISTS patients (
                  id SERIAL PRIMARY KEY,
                  doctor_id INTEGER NOT NULL,
                  name TEXT NOT NULL,
                  age INTEGER NOT NULL,
                  gender TEXT NOT NULL,
                  contact TEXT NOT NULL,
                  email TEXT NULL UNIQUE,
                  remark TEXT NULL,
                  foreign key (doctor_id) references doctors(id));
            `);

    //         `);
  } catch (e) {
    console.log("Error in creating tables", e);
  }
};
