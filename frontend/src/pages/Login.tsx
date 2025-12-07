import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ApiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, ChevronLeft } from 'lucide-react';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await ApiService.login(formData);
      if (response.statusCode === 200 && response.token && response.role) {
        await login(response.token, response.role);
        navigate(from, { replace: true });
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-pop-purple font-sans">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-24 relative z-10 bg-white border-r-3 border-pop-black">
        <Link to="/" className="absolute top-8 left-8 flex items-center font-black uppercase text-sm text-gray-500 hover:text-pop-pink transition-colors">
          <ChevronLeft className="w-5 h-5 mr-1" /> Back to Home
        </Link>

        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="text-center lg:text-left">
            <div className="inline-block bg-pop-yellow border-2 border-pop-black shadow-neo px-4 py-1 transform -rotate-2 mb-4">
              <span className="font-black uppercase tracking-widest text-xs">Members Only</span>
            </div>
            <h2 className="text-5xl font-display font-black text-pop-black mb-3 uppercase">Welcome Back</h2>
            <p className="text-gray-600 text-lg font-bold">Enter your details to access the club.</p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-600 p-4 border-2 border-red-500 font-bold shadow-neo-sm flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-5">
              <div className="relative group">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-pop-black font-bold text-pop-black placeholder-gray-400 focus:outline-none focus:bg-pop-yellow/20 transition-all shadow-neo-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-pop-black font-bold text-pop-black placeholder-gray-400 focus:outline-none focus:bg-pop-yellow/20 transition-all shadow-neo-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-5 w-5 text-pop-black border-2 border-pop-black rounded focus:ring-0" />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-bold text-gray-700">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-bold text-pop-blue hover:text-pop-black transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-4 px-4 border-3 border-pop-black text-xl font-black uppercase text-pop-black bg-pop-mint hover:bg-pop-pink transition-all shadow-neo hover:shadow-neo-lg hover:-translate-y-1 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <Loader2 className="animate-spin h-6 w-6" />
              ) : (
                <span className="flex items-center">
                  Sign In <ArrowRight className="ml-2 h-6 w-6" />
                </span>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-bold text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-black text-pop-black hover:text-pop-blue transition-colors uppercase">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-pop-yellow border-l-3 border-pop-black">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-50 mix-blend-multiply grayscale"></div>
        <div className="absolute inset-0 bg-pop-yellow/30 mix-blend-multiply"></div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-pop-pink rounded-full border-3 border-pop-black mix-blend-hard-light animate-bounce-slow"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-pop-blue rotate-45 border-3 border-pop-black mix-blend-hard-light"></div>

        <div className="absolute bottom-0 left-0 right-0 p-20">
          <h3 className="text-6xl font-display font-black uppercase text-pop-black leading-none mb-6 drop-shadow-sm">
            "Sleep is for the weak.<br />
            <span className="text-white text-stroke-3 text-stroke-black">Unless it's here."</span>
          </h3>
          <p className="text-pop-black text-xl font-bold tracking-wide border-l-4 border-pop-black pl-4">
            — LuxeStay Experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;