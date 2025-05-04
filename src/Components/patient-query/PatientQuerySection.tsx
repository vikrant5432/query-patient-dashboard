import { usePGlite, useLiveQuery } from "@electric-sql/pglite-react";
import { useState } from "react";
import { queryPatientsData } from "../../services/db-service";
import { Patient } from "../../database/interface";

export function PatientQuerySection({ doctorId }: { doctorId: number }) {
  const db = usePGlite();
  const [query, setQuery] = useState("SELECT * FROM patients ORDER BY id DESC");
  const [customResults, setCustomResults] = useState<unknown[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customPage, setCustomPage] = useState(0);
  const [patientsPage, setPatientsPage] = useState(0);
  const [rowsPerPage] = useState(3);

  // Use live query to automatically update when data changes
  const patients = useLiveQuery<Patient[]>(
    "SELECT * FROM patients WHERE doctor_id = $1",
    [doctorId]
  );

  const executeCustomQuery = async (sqlQuery: string) => {
    setIsLoading(true);
    setError(null);
    setCustomPage(0);

    try {
      const result = await queryPatientsData(sqlQuery, db);
      console.log("Custom query result:", result.rows);
      setCustomResults(result.rows);
      setCustomPage(0); // Reset to first page when new query is executed
    } catch (error) {
      console.error("Error executing custom query:", error);
      setError(
        error instanceof Error ? error.message : "Failed to execute query"
      );
      setCustomResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const paginatedPatients =
    patients?.rows.slice(
      patientsPage * rowsPerPage,
      (patientsPage + 1) * rowsPerPage
    ) || [];

  const paginatedCustom = customResults.slice(
    customPage * rowsPerPage,
    (customPage + 1) * rowsPerPage
  );

  const totalPatientPages = Math.ceil(
    (patients?.rows.length || 0) / rowsPerPage
  );
  const totalCustomPages = Math.ceil(customResults.length / rowsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 bg-[#1e2a3b] p-4 rounded-lg shadow-lg">
        <label htmlFor="custom-query" className="font-medium text-gray-300">
          SQL Query Editor
        </label>
        <textarea
          id="custom-query"
          className="w-full border border-gray-700 bg-[#0f172a] text-gray-100 p-3 rounded font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={3}
          spellCheck="false"
          placeholder="Enter SQL query here..."
        />
        <div className="flex justify-between items-center">
          <div>
            {error && (
              <div className="text-red-400 bg-red-900/30 p-2 rounded text-sm">
                {error}
              </div>
            )}
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400 font-medium"
            onClick={() => executeCustomQuery(query)}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Running Query...
              </span>
            ) : (
              "Execute Query"
            )}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <h3 className="font-semibold mb-2">Your Patients</h3>
        <table className="min-w-full bg-white mb-6 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Age</th>
              <th className="py-2 px-4 text-left">Gender</th>
              <th className="py-2 px-4 text-left">Contact</th>
              <th className="py-2 px-4 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPatients && paginatedPatients.length > 0 ? (
              (paginatedPatients as unknown as Patient[]).map((patient) => (
                <tr key={patient.id} className="border-b">
                  <td className="py-2 px-4">{patient.name}</td>
                  <td className="py-2 px-4">{patient.age}</td>
                  <td className="py-2 px-4">{patient.gender}</td>
                  <td className="py-2 px-4">{patient.contact}</td>
                  <td className="py-2 px-4">{patient.email || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {patients?.rows && patients.rows.length > rowsPerPage && (
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
            <button
              onClick={() => setPatientsPage((p) => Math.max(0, p - 1))}
              disabled={patientsPage === 0}
              className="px-3 py-1 bg-blue-100 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-blue-700">
              Page {patientsPage + 1} of {totalPatientPages}
            </span>
            <button
              onClick={() =>
                setPatientsPage((p) => Math.min(totalPatientPages - 1, p + 1))
              }
              disabled={patientsPage >= totalPatientPages - 1}
              className="px-3 py-1 bg-blue-100 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {customResults.length > 0 && (
        <div className="overflow-x-auto">
          <h3 className="font-semibold mb-2">Query Results</h3>
          <div className="bg-[#1e2a3b] rounded-lg p-3 text-white text-sm mb-2">
            <span className="text-green-400">{customResults.length}</span> rows
            returned
          </div>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(customResults[0] || {}).map((key) => (
                  <th key={key} className="py-2 px-4 text-left">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedCustom.map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  {Object.values(row as Patient).map((value, i) => (
                    <td key={i} className="py-2 px-4 font-mono text-sm">
                      {value !== null ? String(value) : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {customResults.length > 0 && (
            <div className="flex items-center justify-between mt-4 bg-gray-50 p-2 rounded">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCustomPage(0)}
                  disabled={customPage === 0}
                  className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  {0}
                </button>
                {Array.from({ length: Math.min(totalCustomPages, 3) }).map(
                  (_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCustomPage(idx)}
                      className={`px-2 py-1 rounded ${
                        customPage === idx
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  )
                )}
              </div>
              <div className="text-sm text-gray-600">
                Showing {customPage * rowsPerPage + 1} to{" "}
                {Math.min((customPage + 1) * rowsPerPage, customResults.length)}{" "}
                of {customResults.length} results
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
