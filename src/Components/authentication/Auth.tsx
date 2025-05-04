import { useEffect, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import doctorAnimation from "../../assets/animations/doctor-animation.json";
import { usePGlite } from "@electric-sql/pglite-react";
import { getDoctorByEmail, registerDoctor } from "../../services/db-service";
import { LoginForm, RegisterForm } from "../authentication/interface";
import { compareSync, hashSync } from "bcrypt-ts";
import { SuccessRegisterModal } from "../modals/SuccessRegister";
import { Doctor } from "../../database/interface";
import { useNavigate } from "react-router-dom";

const initialRegisterForm = {
  name: "",
  specialty: "",
  email: "",
  password: "",
};

const initalLoginForm = {
  email: "",
  password: "",
};

export default function Auth() {
  const userDetails = localStorage.getItem("userDetails");
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [registerForm, setRegisterForm] =
    useState<RegisterForm>(initialRegisterForm);
  const [registerError, setRegisterError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registerUsername, setRegisterUsername] = useState("");
  const [loginForm, setLoginForm] = useState<LoginForm>(initalLoginForm);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const db = usePGlite();

  const handleLogin = async (loginDetails: LoginForm) => {
    setIsLoading(true);
    const result = await getDoctorByEmail(loginDetails.email, db);
    //check if the password is correct remember password is hashed in the db
    if (result.initialResults.rows.length > 0) {
      const isPasswordCorrect = compareSync(
        loginDetails.password,
        (result.initialResults.rows[0] as Doctor).password
      );
      if (isPasswordCorrect) {
        console.log("Login successful");
        setIsLogin(true);
        setRegisterError("");
        setLoginError("");
        localStorage.setItem(
          "userDetails",
          JSON.stringify(result.initialResults.rows[0])
        );
        navigate("/dashboard");
      } else {
        setLoginError("Invalid email or password");
      }
    } else {
      setLoginError("Invalid email or password");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (userDetails) {
      navigate("/dashboard");
    }
  }, [navigate, userDetails]);

  const handleRegister = async (userData: RegisterForm) => {
    try {
      const existingDoctor = await getDoctorByEmail(userData.email, db);
      if (existingDoctor.initialResults.rows.length > 0) {
        setRegisterError(
          "You are already register with us. Please Login to continue"
        );
        return;
      }
      const hashedPassword = hashSync(userData.password, 10);
      const result = await registerDoctor(
        { ...userData, password: hashedPassword },
        db
      );

      console.log("Doctor registered successfully:", result);
      setRegisterUsername(userData.name);
      setShowSuccessModal(true);
      setIsLogin(true);
      setRegisterError("");
      setRegisterForm(initialRegisterForm);
    } catch (error) {
      setRegisterError("We encountered an issue. Please try again.");
      console.error("Error registering doctor:", error);
    }
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setRegisterError("");
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLoginError("");
  };

  const isLoginForm = () => {
    setIsLogin(!isLogin);
    setRegisterError("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="absolute inset-0 -z-10">
        <img
          src="../src/assets/images/bg-login.jpg"
          alt="Hospital background"
          className="w-full h-full object-cover blur-sm"
        />
        {/* Optional: Add a dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="bg-white rounded-xl shadow-2xl flex w-full max-w-4xl h-[600px] overflow-hidden">
        {/* Left: Forms Section (60%) */}
        <div className="w-3/5 p-12 flex flex-col justify-center">
          <div className="flex gap-4 mb-8">
            <button
              type="button"
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                isLogin
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => isLoginForm()}
            >
              Login
            </button>
            <button
              type="button"
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                !isLogin
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => isLoginForm()}
            >
              Register
            </button>
          </div>
          {isLogin ? (
            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin(loginForm);
              }}
            >
              <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                autoComplete="off"
                onChange={handleLoginChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                autoComplete="off"
                onChange={handleLoginChange}
                required
              />
              {loginError && (
                <div className="text-red-600 bg-red-100 rounded px-3 py-2 text-center">
                  {loginError}
                </div>
              )}
              <button
                type="submit"
                className="mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer w-[70%] mx-auto flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          ) : (
            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleRegister(registerForm);
              }}
            >
              <h2 className="text-2xl font-bold text-gray-800">New Account</h2>
              <input
                type="text"
                name="name"
                autoComplete="off"
                placeholder="Full Name"
                className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                onChange={handleRegisterChange}
                required
              />
              <input
                type="email"
                name="email"
                autoComplete="off"
                placeholder="Email"
                className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                onChange={handleRegisterChange}
                required
              />
              <input
                type="text"
                name="specialty"
                placeholder="Speciality"
                autoComplete="off"
                className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                onChange={handleRegisterChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                onChange={handleRegisterChange}
                required
              />
              {registerError && (
                <div className="text-red-600 bg-red-100 rounded px-3 py-2 text-center">
                  {registerError}
                </div>
              )}
              <button
                type="submit"
                className="w-[70%] mx-auto mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Create Account
              </button>
            </form>
          )}
        </div>
        {/* Right: Animation Section (40%) */}
        <div className="w-2/5 bg-gradient-to-br from-blue-700 to-cyan-500 flex flex-col items-center justify-center relative">
          <div className="text-center px-4">
            <Player
              autoplay
              loop
              src={doctorAnimation}
              className="w-56 h-56 mx-auto"
              style={{ height: "300px", width: "300px" }}
            />
            <h1 className="mt-6 text-white text-3xl font-bold">
              HELLO <span className="text-yellow-300">DOC</span>
            </h1>
            <p className="text-white/90 mt-3 text-base">
              Welcome! Please login or register to continue.
            </p>
          </div>
        </div>
      </div>
      <SuccessRegisterModal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        username={registerUsername}
      />
    </div>
  );
}
