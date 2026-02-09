import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { verify } from "../services/userService";
import { LogIn, UserPlus, LogOut, User, Plus, Menu, X } from "lucide-react";

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    verify(token)
      .then((res) => {
        if (res && res.success && res.data) {

          const { id, name } = res.data;
          setIsLoggedIn(true);
          setUser({ id, name });
          try {
            localStorage.setItem('userId', id);
            localStorage.setItem('userName', name);
          } catch (e) {}
        } else {

          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('userName');
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        setIsLoggedIn(false);
        setUser(null);
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const handleCreateWorkflow = () => {
    if (isLoggedIn) {
      navigate("/workflow");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="bg-[#c5eaec] border-b border-cyan-300 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto p-2 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2">
          
          <span className="text-xl font-semibold text-cyan-900">
            VVC Management
          </span>
        </Link>


        <nav className="hidden md:flex items-center gap-6">
          {isLoggedIn ? (
            <>
              <Link
                to="/home/workflow"
                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-cyan-600 to-teal-500 text-white rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform duration-150 font-semibold"
              >
                <Plus className="w-4 h-4" /> Create Workflow
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 text-cyan-700 hover:text-cyan-900 hover:underline"
                >
                  <User className="w-4 h-4" /> {user?.name || "Profile"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-cyan-600 text-cyan-600 rounded-full bg-white/60 hover:bg-white hover:backdrop-blur-sm transition font-medium"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to='/home/workflow'
                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-cyan-600 to-teal-500 text-white rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform duration-150 font-semibold"
              >
                <Plus className="w-4 h-4" /> Create Workflow
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 px-3 py-2 text-cyan-700 hover:text-cyan-900 hover:underline font-medium"
              >
                <LogIn className="w-4 h-4" /> Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-cyan-600 to-teal-500 text-white rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform duration-150 font-semibold"
              >
                <UserPlus className="w-4 h-4" /> Register
              </Link>
            </>
          )}
        </nav>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-cyan-700 hover:text-cyan-900"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

  
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-cyan-300 bg-cyan-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
            {isLoggedIn ? (
              <>
                <Link
                   to="/home/workflow"
                  className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-cyan-600 to-teal-500 text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-150 font-semibold w-full"
                >
                  <Plus className="w-4 h-4" /> Create Workflow
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 text-cyan-700 hover:text-cyan-900 hover:underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4" /> {user?.name || "Profile"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-cyan-600 text-cyan-600 rounded-lg bg-white/60 hover:bg-white transition font-medium w-full"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/home/workflow"
                  className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-cyan-600 to-teal-500 text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-150 font-semibold w-full"
                >
                  <Plus className="w-4 h-4" /> Create Workflow
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 text-cyan-700 hover:text-cyan-900 hover:underline font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-cyan-600 to-teal-500 text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-150 font-semibold w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserPlus className="w-4 h-4" /> Register
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;