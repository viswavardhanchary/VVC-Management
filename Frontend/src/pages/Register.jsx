import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import { register, verify } from "../services/userService";

const animationStyle = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }
  .float-animation {
    animation: float 8s ease-in-out infinite;
  }
  @keyframes underline {
    0% {
      width: 0;
    }
    100% {
      width: 100%;
    }
  }
  .underline-animation {
    position: relative;
    display: inline-block;
  }
  .underline-animation::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    height: 3px;
    background-color: #a78bce;
    animation: underline 1.5s ease-out infinite;
  }
`;

export const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "developer",
  });
  const [visuals, setVisuals] = useState({
    loading: false,
    toast: { message: "", type: "info" },
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const redirectTo = new URLSearchParams(location.search).get('redirect') || '/home';
    if (token) {
      verify(token).then((res) => {
        if (res.success) {
          navigate(redirectTo, { replace: true });
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('userName');
        }
      });
    }
  }, [location.search, navigate]);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateField = (field, value) => {
    let error = "";

    if (field === "name") {
      if (!value.trim()) {
        error = "Full name is required";
      }
    }

    if (field === "email") {
      if (!value.trim()) {
        error = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Enter a valid email";
      }
    }

    if (field === "password") {
      if (!value.trim()) {
        error = "Password is required";
      } else if (value.length < 6) {
        error = "Password must be at least 6 characters";
      } else if (!/[A-Z]/.test(value)) {
        error = "Password must contain at least one uppercase letter";
      } else if (!/[a-z]/.test(value)) {
        error = "Password must contain at least one lowercase letter";
      } else if (!/\d/.test(value)) {
        error = "Password must contain at least one digit";
      } else if (!/[@#$_&]/.test(value)) {
        error = "Password must contain at least one special character (@, #, $, _, &)";
      }
    }

    if (field === "confirmPassword") {
      if (!value.trim()) {
        error = "Confirm password is required";
      } else if (value !== userData.password) {
        error = "Passwords do not match";
      }
    }

    return error;
  };

  const handleFieldChange = (field, value) => {
    setUserData((u) => ({ ...u, [field]: value }));
    const error = validateField(field, value);
    setErrors((e) => ({ ...e, [field]: error }));
  };

  const handleFieldBlur = (field) => {
    const error = validateField(field, userData[field]);
    setErrors((e) => ({ ...e, [field]: error }));
  };

  const validate = () => {
    const newErrors = {
      name: validateField("name", userData.name),
      email: validateField("email", userData.email),
      password: validateField("password", userData.password),
      confirmPassword: validateField("confirmPassword", userData.confirmPassword),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((err) => err !== "");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setVisuals((v) => ({ ...v, loading: true, toast: { message: "", type: "info" } }));

    register({ name: userData.name, email: userData.email, password: userData.password ,role: userData.role.toLowerCase()}).then((res) => {
      if (res.success && res.data?.token && res.data.user) {
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userName', user.name);
        setVisuals((v) => ({ ...v, loading: false, toast: { message: 'Account created successfully!', type: 'success' } }));
        // Reset form
        setUserData({ name: '', email: '', password: '', confirmPassword: '', role: 'developer' });
        setErrors({ name: '', email: '', password: '', confirmPassword: '' });
        const redirectTo = new URLSearchParams(location.search).get('redirect') || '/home';
        navigate(redirectTo, { replace: true });
      } else {
        setVisuals((v) => ({ ...v, loading: false, toast: { message: res.message || 'Registration failed', type: 'error' } }));
      }
    }).catch((err) => {
      setVisuals((v) => ({ ...v, loading: false, toast: { message: err?.message || 'Registration failed', type: 'error' } }));
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#d6c5ec] px-4 py-4">
      <div className="w-full h-[90vh] bg-transparent overflow-hidden rounded-md">
        <div className="flex flex-col md:flex-row h-full">
          <div className="hidden w-full md:flex flex-1 h-full p-6 bg-linear-to-br">
            <style>{animationStyle}</style>
            <img
              src="/images/register3.png"
              alt="Register visual"
              className="w-full h-full object-cover float-animation"
            />
          </div>

          <div className="w-full flex-1 h-full p-8 bg-white/70 flex flex-col">
            

            <div className="flex gap-2 items-center">
              <h3 className="text-lg text-purple-700">Join Us</h3>
              <style>{animationStyle}</style>
              <h2 className="text-xl font-semibold text-purple-900 underline-animation">VVC Management</h2>
            </div>
            {visuals.toast.message && (
              <div className="mt-4">
                <Toast
                  message={visuals.toast.message}
                  type={visuals.toast.type}
                  onClose={() =>
                    setVisuals((v) => ({
                      ...v,
                      toast: { message: "", type: "info" },
                    }))
                  }
                />
              </div>
            )}

            <div className="flex flex-col h-full w-full gap-5 overflow-y-auto mt-5">

              <form onSubmit={handleRegister} className="space-y-3 space-x-2">
                <div>
                  <label className="block text-sm mb-1 text-purple-700 font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    onBlur={() => handleFieldBlur("name")}
                    disabled={visuals.loading}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.name
                        ? "border-red-500 focus:ring-red-200"
                        : "border-purple-300 focus:ring-purple-200"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-1 text-purple-700 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    onBlur={() => handleFieldBlur("email")}
                    disabled={visuals.loading}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.email
                        ? "border-red-500 focus:ring-red-200"
                        : "border-purple-300 focus:ring-purple-200"
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-1 text-purple-700 font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={userData.password}
                      onChange={(e) => handleFieldChange("password", e.target.value)}
                      onBlur={() => handleFieldBlur("password")}
                      disabled={visuals.loading}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10 ${
                        errors.password
                          ? "border-red-500 focus:ring-red-200"
                          : "border-purple-300 focus:ring-purple-200"
                      }`}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-700"
                      disabled={visuals.loading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-1 text-purple-700 font-medium">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={userData.confirmPassword}
                      onChange={(e) => handleFieldChange("confirmPassword", e.target.value)}
                      onBlur={() => handleFieldBlur("confirmPassword")}
                      disabled={visuals.loading}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10 ${
                        errors.confirmPassword
                          ? "border-red-500 focus:ring-red-200"
                          : "border-purple-300 focus:ring-purple-200"
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-700"
                      disabled={visuals.loading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-1 text-purple-700 font-medium">
                    Role
                  </label>
                  <select
                    value={userData.role}
                    onChange={(e) =>
                      setUserData((u) => ({ ...u, role: e.target.value }))
                    }
                    disabled={visuals.loading}
                    className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200"
                  >
                    <option value="developer">Developer</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={visuals.loading}
                    className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-white font-medium bg-purple-600 ${
                      visuals.loading
                        ? "opacity-60 cursor-not-allowed"
                        : "cursor-pointer"
                    } hover:bg-purple-700`}
                  >
                    <span>Register</span>
                    {visuals.loading && <Loader size={0.75} color="#FFFFFF" />}
                  </button>
                </div>
              </form>

              <div className="flex items-center justify-between text-sm">
                <Link
                  to="/"
                  className="flex items-center text-indigo-600 hover:underline"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
                </Link>
                <Link
                  to="/login"
                  className="flex items-center text-indigo-600 hover:underline"
                >
                  Already have account <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;