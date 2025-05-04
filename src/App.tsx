import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Auth from "./Components/authentication/Auth";
import { useInitDB } from "./hooks/useInitDB";
import { useEffect } from "react";
import { Dashboard } from "./Components/dashboard/Dashboard";
import { ToastContainer } from "react-toastify";
import { isEmpty } from "lodash";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
  useEffect(() => {
    if (!isEmpty(userDetails)) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate, userDetails]);

  if (!userDetails) {
    return null;
  }

  return <>{children}</>;
};

function App() {
  useInitDB();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Makes toasts more visible
      />
    </BrowserRouter>
  );
}

export default App;
