export interface Doctor {
  id?: number;
  name: string;
  specialty: string;
  email: string;
  password: string;
}

export interface Patient {
  id?: number;
  doctor_id: number;
  name: string;
  age: number;
  gender: string;
  contact: string;
  email?: string;
  remark?: string;
}
