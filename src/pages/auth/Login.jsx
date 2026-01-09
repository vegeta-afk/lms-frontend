import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import iitImage from "../../assets/iit.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      console.log("Attempting login with:", { email, password });

      // ✅ USE CENTRALIZED API (axios already imported in services/api)
      const response = await authAPI.login({ email, password });

      console.log("Login response:", response.data);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setSuccess("Login successful!");
        navigate("/admin/dashboard");
      } else {
        setError(response.data.message || "Login failed");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        setError(err.response.data?.message || "Server error");
      } else if (err.request) {
        setError("No response from server. Check CORS or backend.");
      } else {
        setError("Error: " + err.message);
      }
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setError("Google sign-in will be implemented soon");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex overflow-hidden">
        {/* Left side - Welcome/Info section */}
        <div className="hidden md:flex flex-col justify-center items-center bg-linear-to-br from-blue-600 to-indigo-800 text-white p-12 w-1/2">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-2">IIT</h1>
            <p className="text-blue-100 text-lg">
              Intelligent Institute of Training
            </p>
          </div>

          <div className="mb-8 w-full flex justify-center">
            <div className="w-72 h-72 rounded-xl overflow-hidden border-4 border-white shadow-lg">
              <img
                src={iitImage}
                alt="IIT Illustration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Welcome to LMS!</h2>
            <p className="text-blue-200 text-lg">
              Your gateway to online learning
            </p>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              ✅ {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              ❌ {error}
            </div>
          )}

          <div className="md:hidden mb-8 text-center">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">IIT</h1>
            <p className="text-gray-600">Learning Management System</p>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Login to your account
            </h2>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors mb-6 disabled:opacity-50"
          >
            <FaGoogle className="text-blue-500 size-5" />
            {loading ? "Processing..." : "Sign up with Google"}
          </button>

          <div className="flex items-center mb-6">
            <div className="grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="grow border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Enter email or mobile number
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="test@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition mb-2"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <div className="text-right">
                <a
                  href="/forgot-password"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="size-4 text-blue-600 rounded focus:ring-blue-500"
                disabled={loading}
              />
              <label htmlFor="remember" className="ml-2 text-gray-700">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-700 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-colors shadow-lg hover:shadow-xl mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Sign up here
              </a>
            </p>
          </div>

          {/* Test credentials reminder */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 text-center">
              <strong>Test Credentials:</strong>
              <br />
              Email: test@example.com
              <br />
              Password: password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
