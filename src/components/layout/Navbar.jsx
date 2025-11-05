import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Plus, User, LogOut, Home, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-600 rounded-xl flex items-center justify-center group-hover:bg-primary-700 transition-colors">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Khoj</h1>
              <p className="text-xs text-gray-500 hidden sm:block">{user?.college}</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/')
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>

            <Link
              to="/post"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/post')
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>Post Item</span>
            </Link>

            <Link
              to="/profile"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/profile')
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="relative p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 bg-danger-500 rounded-full"></span>
            </button>

            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate max-w-[150px]">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:bg-danger-50 hover:text-danger-600 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-white/90 backdrop-blur-md safe-bottom">
        <div className="flex justify-around py-2">
          <Link
            to="/"
            className={`flex flex-col items-center gap-0.5 sm:gap-1 px-3 sm:px-4 py-2 rounded-lg transition-colors ${
              isActive('/') ? 'text-primary-600' : 'text-gray-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] sm:text-xs font-medium">Home</span>
          </Link>

          <Link
            to="/post"
            className={`flex flex-col items-center gap-0.5 sm:gap-1 px-3 sm:px-4 py-2 rounded-lg transition-colors ${
              isActive('/post') ? 'text-primary-600' : 'text-gray-600'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span className="text-[10px] sm:text-xs font-medium">Post</span>
          </Link>

          <Link
            to="/profile"
            className={`flex flex-col items-center gap-0.5 sm:gap-1 px-3 sm:px-4 py-2 rounded-lg transition-colors ${
              isActive('/profile') ? 'text-primary-600' : 'text-gray-600'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] sm:text-xs font-medium">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
