import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../services/apiService';
import RoomCard from '../components/RoomCard';
import { Search, Calendar, Wifi, Utensils, Phone, ArrowRight, ShieldCheck, ChevronDown, MapPin, Star, Quote, Coffee, Sparkles, Car, User } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await ApiService.getAllRooms();
        if (response.roomList) {
          setRooms(response.roomList.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="bg-pop-purple min-h-screen font-sans text-pop-black overflow-x-hidden">

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center border-b-3 border-pop-black bg-pop-purple">
        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          <div className="inline-block bg-pop-yellow border-2 border-pop-black shadow-neo px-4 py-2 transform -rotate-2 mb-4">
            <span className="font-black uppercase tracking-widest text-sm">Welcome to the Fun Side of Luxury</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black leading-tight tracking-tighter text-pop-black drop-shadow-sm">
            THE ONLY THING<br />
            WE'RE SERIOUS<br />
            ABOUT IS <span className="text-white text-stroke-3 text-stroke-black">COMFORT.</span>
          </h1>

          <p className="text-xl md:text-2xl font-bold max-w-2xl mx-auto text-gray-800">
            Forget boring beige hotels. LuxeStay is your colorful escape into a world of vibrant design and unmatched vibes.
          </p>

          <button
            onClick={() => navigate('/rooms')}
            className="mt-8 px-10 py-5 bg-pop-pink text-pop-black text-xl font-black uppercase tracking-wider border-3 border-pop-black shadow-neo-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all transform hover:rotate-1"
          >
            Book Your Stay
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-pop-mint rounded-full border-3 border-pop-black animate-bounce-slow hidden md:block"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-pop-yellow rotate-12 border-3 border-pop-black hidden md:block"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-pop-blue rounded-none border-3 border-pop-black animate-wiggle hidden md:block"></div>
      </header>

      {/* Search Bar (Floating) */}
      <div className="relative -mt-10 z-20 px-4">
        <div className="max-w-4xl mx-auto bg-white border-3 border-pop-black shadow-neo-lg p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center transform rotate-1 hover:rotate-0 transition-transform duration-300">
          <div className="flex-1 w-full">
            <label className="block text-xs font-black uppercase mb-1 ml-1">Check In</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input type="date" className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-pop-black font-bold focus:outline-none focus:bg-pop-yellow/20 transition-colors" />
            </div>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-black uppercase mb-1 ml-1">Check Out</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input type="date" className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-pop-black font-bold focus:outline-none focus:bg-pop-yellow/20 transition-colors" />
            </div>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-black uppercase mb-1 ml-1">Guests</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-pop-black font-bold focus:outline-none focus:bg-pop-yellow/20 transition-colors appearance-none">
                <option>1 Guest</option>
                <option>2 Guests</option>
                <option>3+ Guests</option>
              </select>
            </div>
          </div>
          <button className="w-full md:w-auto px-8 py-3 bg-pop-black text-white font-black uppercase tracking-wider border-2 border-pop-black hover:bg-pop-yellow hover:text-pop-black transition-colors shadow-neo h-full mt-5">
            Search
          </button>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-b-3 border-pop-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase mb-4">Why Stay With Us?</h2>
            <p className="text-xl font-bold text-gray-500">Because normal hotels are boring.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: "Vibe Check Passed", desc: "Every corner is Instagram-worthy. We promise.", color: "bg-pop-pink" },
              { icon: Coffee, title: "Gourmet Munchies", desc: "Breakfast that actually tastes good. 24/7.", color: "bg-pop-yellow" },
              { icon: Wifi, title: "Blazing WiFi", desc: "Stream, game, or work (if you must) without lag.", color: "bg-pop-mint" }
            ].map((feature, index) => (
              <div key={index} className="group p-8 border-3 border-pop-black bg-white shadow-neo hover:shadow-neo-lg hover:-translate-y-2 transition-all duration-300">
                <div className={`w-16 h-16 ${feature.color} border-3 border-pop-black flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
                  <feature.icon className="h-8 w-8 text-pop-black" />
                </div>
                <h3 className="text-2xl font-display font-black uppercase mb-3">{feature.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-pop-blue border-b-3 border-pop-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-black uppercase text-pop-black mb-2">Our Cribs</h2>
              <p className="text-xl font-bold text-pop-black/70">Pick your flavor.</p>
            </div>
            <button onClick={() => navigate('/rooms')} className="mt-6 md:mt-0 px-6 py-3 bg-white text-pop-black font-black uppercase border-3 border-pop-black shadow-neo hover:bg-pop-yellow transition-all">
              View All Rooms
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.length > 0 ? (
              rooms.map((room: any) => (
                <RoomCard key={room.id} room={room} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white border-3 border-pop-black shadow-neo">
                <p className="text-xl font-bold">Loading amazing rooms...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-pop-yellow border-b-3 border-pop-black">
        <div className="max-w-4xl mx-auto text-center">
          <Quote className="h-16 w-16 text-pop-black mx-auto mb-8 opacity-20" />
          <h2 className="text-3xl md:text-5xl font-display font-black uppercase leading-tight mb-8">
            "I CAME FOR THE BED,<br />STAYED FOR THE VIBES."
          </h2>
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-12 bg-pop-black rounded-full border-2 border-white"></div>
            <div className="text-left">
              <p className="font-black uppercase text-lg">Alex The Creator</p>
              <p className="font-bold text-sm opacity-70">Verified Guest</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-pop-black text-white text-center">
        <h2 className="text-4xl md:text-6xl font-display font-black uppercase mb-8 text-pop-pink">
          Ready to Join the Club?
        </h2>
        <p className="text-xl font-bold mb-10 max-w-2xl mx-auto text-gray-400">
          Life is too short for boring hotels. Book your stay at LuxeStay today.
        </p>
        <button
          onClick={() => navigate('/rooms')}
          className="px-12 py-6 bg-pop-mint text-pop-black text-xl font-black uppercase tracking-wider border-3 border-white shadow-[8px_8px_0px_0px_#ffffff] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          Get A Room
        </button>
      </section>

    </div>
  );
};

export default Home;