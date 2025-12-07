import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ApiService } from '../services/apiService';
import { User, Mail, Phone, Lock, Loader2, ArrowRight, AlertCircle, CheckCircle, ChevronLeft } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await ApiService.register(formData);
      if (response.statusCode === 200) {
        navigate('/login', { state: { message: 'Registration successful! Please login.' } });
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-pop-purple font-sans">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-pop-mint border-r-3 border-pop-black">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-50 mix-blend-multiply grayscale"></div>
        <div className="absolute inset-0 bg-pop-mint/30 mix-blend-multiply"></div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-pop-yellow rounded-none border-3 border-pop-black mix-blend-hard-light animate-spin-slow"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-pop-pink rounded-full border-3 border-pop-black mix-blend-hard-light animate-bounce"></div>

        <div className="absolute bottom-0 left-0 p-16 w-full">
          <div className="mb-12">
            <h3 className="text-6xl font-display font-black uppercase text-pop-black leading-none mb-6 drop-shadow-sm">
              Join The<br />
              <span className="text-white text-stroke-3 text-stroke-black">Cool Kids.</span>
            </h3>
            <p className="text-pop-black text-xl font-bold max-w-lg leading-relaxed border-l-4 border-pop-black pl-4">
              Unlock exclusive deals, secret rooms, and bragging rights.
            </p>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center space-x-3 bg-white px-5 py-3 border-2 border-pop-black shadow-neo transform -rotate-2">
              <div className="p-1 bg-pop-mint border-2 border-pop-black rounded-full">
                <CheckCircle className="h-4 w-4 text-pop-black" />
              </div>
              <span className="text-sm font-black uppercase">Instant Booking</span>
            </div>
            <div className="flex items-center space-x-3 bg-white px-5 py-3 border-2 border-pop-black shadow-neo transform rotate-1">
              <div className="p-1 bg-pop-mint border-2 border-pop-black rounded-full">
                <CheckCircle className="h-4 w-4 text-pop-black" />
              </div>
              <span className="text-sm font-black uppercase">Best Rates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-24 relative bg-white">
        <Link to="/" className="absolute top-8 right-8 flex items-center font-black uppercase text-sm text-gray-500 hover:text-pop-pink transition-colors lg:hidden">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Link>

        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-5xl font-display font-black text-pop-black mb-3 uppercase">Sign Up</h2>
            <p className="text-gray-600 text-lg font-bold">It takes less than a minute.</p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-600 p-4 border-2 border-red-500 font-bold shadow-neo-sm flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="relative group">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-pop-black font-bold text-pop-black placeholder-gray-400 focus:outline-none focus:bg-pop-yellow/20 transition-all shadow-neo-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2 ml-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-pop-black font-bold text-pop-black placeholder-gray-400 focus:outline-none focus:bg-pop-yellow/20 transition-all shadow-neo-sm"
                  placeholder="+1 (555) 000-0000"
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

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-4 px-4 border-3 border-pop-black text-xl font-black uppercase text-pop-black bg-pop-yellow hover:bg-pop-pink transition-all shadow-neo hover:shadow-neo-lg hover:-translate-y-1 mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <Loader2 className="animate-spin h-6 w-6" />
              ) : (
                <span className="flex items-center">
                  Create Account <ArrowRight className="ml-2 h-6 w-6" />
                </span>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-bold text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-black text-pop-black hover:text-pop-blue transition-colors uppercase">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;