import { Doctor } from "../../database/interface";

export interface RegisterForm extends Doctor {
  additionalField?: string;
}

export interface LoginForm extends Pick<Doctor, "email" | "password"> {
  additionalField?: string;
}
