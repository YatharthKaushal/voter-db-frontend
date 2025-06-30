import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import icon from "../../assets/icon.png";

const LoadingSpinner = ({ size = "medium", className = "" }) => (
  <div
    className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${
      size === "small" ? "h-4 w-4" : "h-6 w-6"
    } ${className}`}
  />
);

const Login = () => {
  const { isLoggedIn, login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Initialize state with the current online status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Function to update the online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Add event listeners for 'online' and 'offline' events
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Initial check on mount (important for when the component mounts after the initial load)
    updateOnlineStatus();

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  if (!isOnline) return <Navigate to="/voters/offline" replace />;
  if (isLoggedIn) return <Navigate to="/dashboard" replace />;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    // else if (!/\S+@\S+\.\S+/.test(formData.username))
    //   newErrors.username = "Username is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    try {
      await login(formData);
      // await login(formData.username, formData.password);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex items-center justify-center p4">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-emerald-200/30 rounded-full blur-xl" />
        <div className="absolute bottom-32 right-20 w-24 h-24 bg-cyan-200/40 rounded-full blur-lg" />
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-teal-300/20 rounded-full blur-md" />
      </div>

      <div className="flex  w-full h-full">
        {/* left side */}
        <div
          className={`hidden md:flex flex-col justify-center items-center m-auto bg-blue-800 min-h-screen w-[26rem text-white p-6 border-`}
        >
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-white to-green-500 rounded-xl flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-900 rounded-md flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">भारत</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">भारत निर्वाचन आयोग</h1>
          <h2 className="text-xl font-semibold mb-6">
            Election Commission of India
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed text-center">
            Secure access to your voter information and electoral services
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center justify-center space-x-2 text-blue-200">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Secure Voter's Portal</span>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className="w[50%] w-full max-h-screen overflow-auto relative p-6 border-">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8  max-w-md m-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="rounded-2xl bg-red-50 p-4 border border-red-200">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="username"
                      name="username"
                      // type="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50/80 border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.username
                          ? "border-red-300 focus:ring-red-500/50 focus:border-red-500"
                          : "border-gray-200 focus:ring-emerald-500/50 focus:border-emerald-500"
                      }`}
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.username}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className={`w-full pl-12 pr-12 py-4 bg-gray-50/80 border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.password
                          ? "border-red-300 focus:ring-red-500/50 focus:border-red-500"
                          : "border-gray-200 focus:ring-emerald-500/50 focus:border-emerald-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Forgot password?
                </button>
              </div> */}
              <div className="mb-6 p-4 bg-emerald-50/80 backdrop-blur-sm rounded-2xl border border-emerald-200/5  max-w-md m-auto">
                <p className="text-sm text-emerald-700 text-center">
                  <strong>Demo:</strong> admin1 / securepassword123{" | "}
                  <span>
                    <a
                      href="/voters/offline"
                      className="text-sm text-emerald-800 bg-emerald-200 rounded-sm px-0.5"
                    >
                      <strong>Offline Mode {">"}</strong>
                    </a>
                  </span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
              >
                {loading && (
                  <LoadingSpinner size="small" className="mr-2 text-white" />
                )}
                Sign In
              </button>

              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="font-semibold text-emerald-600 hover:text-emerald-700"
                    onClick={() => navigate("/register")}
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
