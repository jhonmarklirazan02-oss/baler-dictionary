import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import Translate from './pages/Translate';
import Dictionary from './pages/Dictionary';
import AdminLogin from './pages/AdminLogin';
import AudioManagement from './pages/AudioManagement';
import { useState } from 'react';

function Navigation() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="glass border-b border-white/20 p-4">
      <div className="max-w-7xl mx-auto">
        {}
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Baler Dictionary
          </Link>
          <div className="flex gap-2 md:gap-4 items-center">
            <ThemeToggle />
            {user?.isAdmin && (
              <>
                <span className="text-themed-secondary text-sm md:text-base hidden sm:inline">
                  Admin: {user.username}
                </span>
                <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-1 rounded hidden sm:inline">
                  Admin
                </span>
                <button
                  onClick={logout}
                  className="glass-hover px-3 md:px-4 py-2 rounded-lg hover:text-pink-400 transition-colors text-sm md:text-base"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          <Link
            to="/"
            className={`px-4 md:px-6 py-2 rounded-lg transition-colors whitespace-nowrap text-sm md:text-base ${isActive('/')
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold'
                : 'glass-hover text-themed'
              }`}
          >
            Translate
          </Link>
          <Link
            to="/dictionary"
            className={`px-4 md:px-6 py-2 rounded-lg transition-colors whitespace-nowrap text-sm md:text-base ${isActive('/dictionary')
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold'
                : 'glass-hover text-themed'
              }`}
          >
            Dictionary
          </Link>
          {user?.isAdmin && (
            <Link
              to="/audio-management"
              className={`px-4 md:px-6 py-2 rounded-lg transition-colors whitespace-nowrap text-sm md:text-base ${isActive('/audio-management')
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold'
                  : 'glass-hover text-themed'
                }`}
            >
              Audio 🎵
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <Navigation />
            <Routes>
              <Route path="/" element={<Translate />} />
              <Route path="/dictionary" element={<Dictionary />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/audio-management" element={<AudioManagement />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;