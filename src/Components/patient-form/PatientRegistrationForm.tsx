import { useState } from "react";
import { addPatient } from "../../services/db-service";
import { PatientRegisterForm } from "../dashboard/interface";
import { usePGlite } from "@electric-sql/pglite-react";
import { toast } from "react-toastify";

// Register new patients
const initialPatientData: PatientRegisterForm = {
  name: "",
  age: "" as unknown as number,
  gender: "",
  contact: "",
  email: "",
  remark: "",
};

export function PatientRegistrationForm({ doctorId }: { doctorId: number }) {
  const db = usePGlite();
  const [patientData, setPatientData] =
    useState<PatientRegisterForm>(initialPatientData);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setPatientData((prev) => ({
      ...prev,
      [name]: name === "age" ? value.replace(/^0+/, "") : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const convertedAge = Number(patientData.age) || 0;
      const data = await addPatient(
        { ...patientData, doctor_id: doctorId, age: convertedAge },
        db
      );
      // Reset form after successful submission
      console.log("Patient registered successfully:", data);
      setPatientData(initialPatientData);
      toast.success("Patient registered successfully!");
    } catch (error) {
      console.error("Error registering patient:", error);
      toast.error("Failed to register patient. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={patientData.name}
          onChange={handleChange}
          placeholder="Patient Name"
          className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="age" className="text-sm font-medium text-gray-700">
          Age
        </label>
        <input
          id="age"
          name="age"
          type="number"
          value={patientData.age}
          onChange={handleChange}
          placeholder="Age"
          min="0"
          max="120"
          className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="gender" className="text-sm font-medium text-gray-700">
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          value={patientData.gender}
          onChange={handleChange}
          className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          required
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact" className="text-sm font-medium text-gray-700">
          Contact Number
        </label>
        <input
          id="contact"
          name="contact"
          type="tel"
          pattern="[0-9]*"
          value={patientData.contact}
          onChange={handleChange}
          placeholder="Contact Number"
          inputMode="numeric"
          className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={patientData.email}
          onChange={handleChange}
          placeholder="Email Address (Optional)"
          className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="remark" className="text-sm font-medium text-gray-700">
          Remarks
        </label>
        <textarea
          id="remark"
          name="remark"
          value={patientData.remark}
          onChange={handleChange}
          placeholder="Additional notes about the patient"
          className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-24 resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-6"
      >
        Register Patient
      </button>
    </form>
  );
}
