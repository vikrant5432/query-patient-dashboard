import { Patient } from "../../database/interface";

export interface PatientRegisterForm
  extends Pick<
    Patient,
    "name" | "age" | "gender" | "contact" | "email" | "remark"
  > {
  additionalField?: string;
}
