import { useNavigate } from "react-router-dom";
import { PatientRegistrationForm } from "../patient-form/PatientRegistrationForm";
import { PatientQuerySection } from "../patient-query/PatientQuerySection";

export function Dashboard() {
  const navigate = useNavigate();

  const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");

  const logout = () => {
    localStorage.removeItem("userDetails");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <header className="flex justify-between items-center p-4 bg-gray-100 shadow-lg border-b border-blue-100 backdrop-blur-md">
        <h1 className="text-xl font-bold text-blue-600">Patient Management</h1>
        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-700">
            {userDetails?.name || "Doctor"}
          </span>
          <span className="text-sm text-gray-500">
            {userDetails?.specialty}
          </span>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content: 30:70 on desktop, stacked on mobile */}
      <main className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
        {/* Registration Form (30% width on desktop, full width on mobile) */}
        <section className="-full md:w-3/10 bg-white/80 p-6 rounded-xl shadow-2xl border-b md:border-r md:border-b-0 border-gray-200 overflow-auto">
          <h2 className="text-lg font-bold mb-4">Register Patient</h2>
          <PatientRegistrationForm doctorId={userDetails?.id} />
        </section>

        {/* Query Section (70% width on desktop, full width on mobile) */}
        <section className="w-full md:w-7/10 p-6 overflow-auto">
          <h2 className="text-lg font-bold mb-4">Query Patients</h2>
          <PatientQuerySection doctorId={userDetails?.id} />
        </section>
      </main>
    </div>
  );
}
