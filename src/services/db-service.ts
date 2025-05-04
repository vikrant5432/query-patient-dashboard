import { Results } from "@electric-sql/pglite";
import { Doctor, Patient } from "../database/interface";
import { LiveQuery, PGliteWithLive } from "@electric-sql/pglite/live";

export const registerDoctor = async (
  Doctor: Doctor,
  db: PGliteWithLive
): Promise<Results<unknown>> => {
  const { name, specialty, email, password } = Doctor;
  const result = await db.query(
    `INSERT INTO doctors (name, specialty, email, password) VALUES ($1, $2, $3, $4)`,
    [name, specialty, email, password]
  );
  return result;
};

export const getDoctorByEmail = async (
  email: string,
  db: PGliteWithLive
): Promise<LiveQuery<unknown>> => {
  const result = await db.live.query(`SELECT * FROM doctors WHERE email = $1`, [
    email,
  ]);
  return result;
};

export const addPatient = async (
  patientDetails: Patient,
  db: PGliteWithLive
): Promise<Results<unknown>> => {
  const result = await db.query(
    `INSERT INTO patients (doctor_id, name,age, gender,contact, email, remark) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      patientDetails.doctor_id,
      patientDetails.name,
      patientDetails.age,
      patientDetails.gender,
      patientDetails.contact,
      patientDetails.email,
      patientDetails.remark,
    ]
  );

  return result;
};

export const queryPatientsData = async (
  query: string,
  db: PGliteWithLive
): Promise<Results<unknown>> => {
  return db.query(query);
};
