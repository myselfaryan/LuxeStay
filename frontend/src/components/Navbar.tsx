import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, ChevronDown, Hotel, Sparkles } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path: string) => location.pathname === path ? "bg-pop-yellow text-pop-black border-2 border-pop-black shadow-neo-sm transform -translate-y-1" : "hover:bg-pop-pink hover:text-pop-black hover:border-2 hover:border-pop-black hover:shadow-neo-sm transition-all";
  const mobileIsActive = (path: string) => location.pathname === path ? "bg-pop-yellow text-pop-black border-2 border-pop-black shadow-neo" : "text-pop-black hover:bg-pop-pink border-2 border-transparent hover:border-pop-black";

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 border-b-3 border-pop-black ${scrolled ? 'bg-white py-2' : 'bg-white py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group" onClick={closeMenu}>
              <div className="p-2 bg-pop-black rounded-none border-2 border-pop-black shadow-neo group-hover:bg-pop-yellow transition-all">
                <Hotel className="h-6 w-6 text-white group-hover:text-pop-black" />
              </div>
              <span className="text-2xl font-display font-black text-pop-black tracking-tighter uppercase drop-shadow-sm">LuxeStay</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/rooms" className={({ isActive }) => `px-4 py-2 font-black text-sm uppercase tracking-wide transition-all ${isActive ? 'bg-pop-yellow text-pop-black border-2 border-pop-black shadow-neo-sm transform -translate-y-1' : 'text-pop-black hover:bg-pop-pink hover:border-2 hover:border-pop-black hover:shadow-neo-sm border-2 border-transparent'}`}>
              Rooms
            </NavLink>
            <NavLink to="/find-my-room" className={({ isActive }) => `px-4 py-2 font-black text-sm uppercase tracking-wide transition-all flex items-center ${isActive ? 'bg-pop-yellow text-pop-black border-2 border-pop-black shadow-neo-sm transform -translate-y-1' : 'text-pop-black hover:bg-pop-pink hover:border-2 hover:border-pop-black hover:shadow-neo-sm border-2 border-transparent'}`}>
              <Sparkles className="w-4 h-4 mr-2" /> AI Match
            </NavLink>
            <NavLink to="/find-booking" className={({ isActive }) => `px-4 py-2 font-black text-sm uppercase tracking-wide transition-all ${isActive ? 'bg-pop-yellow text-pop-black border-2 border-pop-black shadow-neo-sm transform -translate-y-1' : 'text-pop-black hover:bg-pop-pink hover:border-2 hover:border-pop-black hover:shadow-neo-sm border-2 border-transparent'}`}>
              Find Booking
            </NavLink>

            {isAuthenticated ? (
              <div className="relative group ml-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-pop-mint border-2 border-pop-black shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all">
                  <User className="h-5 w-5" />
                  <span className="font-bold uppercase">Account</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-pop-black shadow-neo-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                  <div className="py-1">
                    <Link to="/profile" className="block px-4 py-3 text-sm font-bold hover:bg-pop-yellow border-b-2 border-pop-black">Profile</Link>
                    {isAdmin && (
                      <>
                        <Link to="/admin/rooms" className="block px-4 py-3 text-sm font-bold hover:bg-pop-yellow border-b-2 border-pop-black">Manage Rooms</Link>
                        <Link to="/admin/bookings" className="block px-4 py-3 text-sm font-bold hover:bg-pop-yellow border-b-2 border-pop-black">Manage Bookings</Link>
                        <Link to="/admin/users" className="block px-4 py-3 text-sm font-bold hover:bg-pop-yellow border-b-2 border-pop-black">Manage Users</Link>
                      </>
                    )}
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-100">
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-4">
                <Link to="/login" className="px-6 py-2 font-bold text-sm uppercase border-2 border-pop-black bg-white shadow-neo hover:bg-pop-pink hover:shadow-neo-lg hover:-translate-y-1 transition-all">
                  Login
                </Link>
                <Link to="/register" className="px-6 py-2 font-bold text-sm uppercase border-2 border-pop-black bg-pop-yellow shadow-neo hover:bg-pop-mint hover:shadow-neo-lg hover:-translate-y-1 transition-all">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="p-2 border-2 border-pop-black bg-white shadow-neo hover:bg-pop-yellow transition-all">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 z-40 bg-pop-purple transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} pt-24 px-6 border-l-3 border-pop-black`}>
        <div className="flex flex-col space-y-4">
          <Link to="/rooms" onClick={closeMenu} className={`block px-4 py-4 text-xl font-black uppercase tracking-wider border-2 border-pop-black bg-white shadow-neo ${mobileIsActive('/rooms')}`}>
            Find A Room
          </Link>
          <Link to="/find-booking" onClick={closeMenu} className={`block px-4 py-4 text-xl font-black uppercase tracking-wider border-2 border-pop-black bg-white shadow-neo ${mobileIsActive('/find-booking')}`}>
            Find Booking
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={closeMenu} className="block px-4 py-4 text-xl font-black uppercase tracking-wider border-2 border-pop-black bg-pop-mint shadow-neo">
                My Profile
              </Link>
              {isAdmin && (
                <>
                  <Link to="/admin/rooms" onClick={closeMenu} className="block px-4 py-4 text-xl font-black uppercase tracking-wider border-2 border-pop-black bg-pop-blue shadow-neo">
                    Manage Rooms
                  </Link>
                  <Link to="/admin/bookings" onClick={closeMenu} className="block px-4 py-4 text-xl font-black uppercase tracking-wider border-2 border-pop-black bg-pop-blue shadow-neo">
                    Manage Bookings
                  </Link>
                  <Link to="/admin/users" onClick={closeMenu} className="block px-4 py-4 text-xl font-black uppercase tracking-wider border-2 border-pop-black bg-pop-blue shadow-neo">
                    Manage Users
                  </Link>
                </>
              )}
              <button onClick={() => { handleLogout(); closeMenu(); }} className="block w-full text-left px-4 py-4 text-xl font-black uppercase tracking-wider border-2 border-pop-black bg-red-400 text-white shadow-neo">
                Sign Out
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Link to="/login" onClick={closeMenu} className="text-center px-4 py-4 text-lg font-black uppercase border-2 border-pop-black bg-white shadow-neo">
                Login
              </Link>
              <Link to="/register" onClick={closeMenu} className="text-center px-4 py-4 text-lg font-black uppercase border-2 border-pop-black bg-pop-yellow shadow-neo">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;