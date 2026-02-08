import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import { login, verify } from "../services/userService";

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
    background-color: #06B6D4;
    animation: underline 1.5s ease-out infinite;
  }
`;

export const Login = () => {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [visuals, setVisuals] = useState({ loading: false, toast: { message: "", type: "info" } });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const redirectTo = new URLSearchParams(location.search).get('redirect') || '/home';
    if (token) {
      // verify token on page load
      verify(token).then((res) => {
        if (res.success) {
          navigate(redirectTo, { replace: true });
        } else {
          // invalid token - clear
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('userName');
        }
      });
    }
  }, [location.search, navigate]);

  const validate = () => {
    if (!userData.email.trim() || !userData.password.trim()) {
      setVisuals((v) => ({ ...v, toast: { message: "Please fill in all fields.", type: "error" } }));
      return false;
    }
    return true;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setVisuals((v) => ({ ...v, loading: true, toast: { message: "", type: "info" } }));

    login({ email: userData.email, password: userData.password }).then((res) => {
      if (res.success && res.data?.token && res.data.user) {
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userName', user.name);
        setVisuals((v) => ({ ...v, loading: false, toast: { message: 'Login successful!', type: 'success' } }));
        const redirectTo = new URLSearchParams(location.search).get('redirect') || '/home';
        navigate(redirectTo, { replace: true });
      } else {
        setVisuals((v) => ({ ...v, loading: false, toast: { message: res.message || 'Invalid credentials', type: 'error' } }));
      }
    }).catch((err) => {
      setVisuals((v) => ({ ...v, loading: false, toast: { message: err?.message || 'Login failed', type: 'error' } }));
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#c5eaec] px-4 py-8">
      <div className="w-full h-[85vh] overflow-hidden rounded-md">
        <div className="flex flex-col md:flex-row h-full">
          <div className="hidden md:flex flex-1 h-full p-0 bg-linear-to-br">
            <style>{animationStyle}</style>
            <img src="/images/login1.png" alt="Login visual" className="w-full h-full object-cover float-animation" />
          </div>

          <div className="w-full flex-1 h-full p-8 bg-white/70 flex flex-col">
            

            <div className="flex gap-2 items-center">
              <h3 className="text-lg text-cyan-700">Welcome back</h3>
              <style>{animationStyle}</style>
              <h2 className="text-xl font-semibold text-cyan-900 underline-animation">VVC Management</h2>
            </div>

            {visuals.toast.message && (
              <div className="mt-4">
                <Toast
                  message={visuals.toast.message}
                  type={visuals.toast.type}
                  onClose={() => setVisuals((v) => ({ ...v, toast: { message: "", type: "info" } }))}
                />
              </div>
            )}

            <div className="flex flex-col h-full w-full gap-7 overflow-y-auto mt-5">

              <form className="space-y-4">
                <div>
                  <label className="block text-lg mb-1 text-cyan-700">Email</label>
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData((u) => ({ ...u, email: e.target.value }))}
                    disabled={visuals.loading}
                    className="w-full px-3 py-2 border border-cyan-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-200"
                  />
                </div>

                <div>
                  <label className="block text-lg mb-1 text-cyan-700">Password</label>
                  <input
                    type="password"
                    value={userData.password}
                    onChange={(e) => setUserData((u) => ({ ...u, password: e.target.value }))}
                    disabled={visuals.loading}
                    className="w-full px-3 py-2 border border-cyan-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-200"
                  />
                </div>

                
              </form>
              <div className="w-full flex flex-col items-start gap-4">
                <div className="pt-2">
                  <button
                    onClick={handleLogin}
                    disabled={visuals.loading}
                    className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-white font-medium bg-[#06B6D4] ${visuals.loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} hover:bg-[#5acade]`}
                    
                  >
                    <span>Login</span>
                    {visuals.loading && <Loader size={0.75} color="#FFFFFF" />}
                  </button>
                </div>
                <div className="flex items-center justify-between text-sm w-full">
                  <Link to="/" className="flex items-center text-indigo-600 hover:underline">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
                  </Link>
                  <Link to="/register" className="flex items-center text-indigo-600 hover:underline">
                    Create account <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
