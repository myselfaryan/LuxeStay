import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ApiService } from '../services/apiService';
import { RoomDTO } from '../types';
import { useAuth } from '../context/AuthContext';
import { Check, User, Users, Calendar, Wifi, Coffee, Monitor, Wind, ShieldCheck, Star, ArrowLeft } from 'lucide-react';

const RoomDetails: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<RoomDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Booking Form State
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numOfAdults: 1,
    numOfChildren: 0
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        if (!roomId) return;
        const response = await ApiService.getRoomById(roomId);
        if (response.room) {
          setRoom(response.room);
        } else {
          setError('Room not found');
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching room details');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    // Redirect to Payment Page with booking details
    navigate('/payment', {
      state: {
        bookingDetails: {
          ...bookingData,
          roomId: room?.id,
          userId: user.id
        },
        roomPrice: room?.roomPrice
      }
    });
  };

  if (loading) {
    return (
      <div className="bg-pop-purple font-sans min-h-screen flex items-center justify-center">
        <div className="text-4xl font-black uppercase text-pop-black animate-bounce">Loading...</div>
      </div>
    );
  }

  if (!room) return <div className="text-center py-20 text-gray-500">Room not found.</div>;

  const imageUrl = room.roomPhotoUrl || 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';

  return (
    <div className="bg-pop-purple font-sans min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <button onClick={() => navigate(-1)} className="mb-8 flex items-center font-black uppercase text-pop-black hover:text-pop-pink transition-colors">
          <ArrowLeft className="mr-2 h-6 w-6" /> Back to Rooms
        </button>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* Left Column: Image & Details */}
          <div className="lg:w-2/3 space-y-8">

            {/* Image */}
            <div className="relative h-[400px] md:h-[500px] w-full border-3 border-pop-black shadow-neo-lg bg-white p-2 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <img
                src={imageUrl}
                alt={room.roomType}
                className="w-full h-full object-cover border-2 border-pop-black"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'; }}
              />
              <div className="absolute top-6 right-6 bg-pop-yellow text-pop-black px-4 py-2 font-black uppercase text-lg border-2 border-pop-black shadow-neo transform rotate-3">
                Premium
              </div>
            </div>

            {/* Title & Description */}
            <div className="bg-white border-3 border-pop-black shadow-neo p-8">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-4xl md:text-5xl font-display font-black uppercase text-pop-black leading-tight">{room.roomType}</h1>
                <div className="flex items-center space-x-1 bg-pop-mint px-3 py-1 border-2 border-pop-black shadow-neo-sm transform -rotate-2">
                  <Star className="w-5 h-5 fill-current text-pop-black" />
                  <span className="font-black text-lg">5.0</span>
                </div>
              </div>

              <p className="text-gray-700 text-lg font-medium leading-relaxed mb-8 border-l-4 border-pop-pink pl-4">
                {room.roomDescription}
                {!room.roomDescription.includes('.') && " Experience the epitome of luxury in our meticulously designed suite. Featuring panoramic views, bespoke furniture, and an ambiance of tranquility, this is the perfect sanctuary for the discerning traveler."}
              </p>

              <h3 className="text-2xl font-display font-black uppercase mb-6 border-b-3 border-pop-black inline-block pb-1">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { icon: Wifi, label: "Fast Wifi" },
                  { icon: Coffee, label: "Coffee" },
                  { icon: Monitor, label: "Smart TV" },
                  { icon: Wind, label: "AC" },
                  { icon: ShieldCheck, label: "Safe" },
                  { icon: Users, label: "Service" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center p-3 bg-gray-50 border-2 border-pop-black hover:bg-pop-blue transition-colors">
                    <item.icon className="w-5 h-5 mr-3 text-pop-black" />
                    <span className="font-bold uppercase text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="bg-pop-black text-white border-3 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] p-8">
              <h2 className="text-2xl font-display font-black uppercase mb-6 text-pop-pink">House Rules</h2>
              <ul className="space-y-3 font-bold">
                <li className="flex items-center"><Check className="w-5 h-5 text-pop-mint mr-3" /> Check-in: 3:00 PM - 10:00 PM</li>
                <li className="flex items-center"><Check className="w-5 h-5 text-pop-mint mr-3" /> Check-out: 11:00 AM</li>
                <li className="flex items-center"><Check className="w-5 h-5 text-pop-mint mr-3" /> No smoking</li>
                <li className="flex items-center"><Check className="w-5 h-5 text-pop-mint mr-3" /> Pets are not allowed</li>
              </ul>
            </div>

          </div>

          {/* Right Column: Booking Widget */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 bg-white border-3 border-pop-black shadow-neo-lg p-6 md:p-8">
              <div className="mb-8 text-center border-b-3 border-pop-black pb-6">
                <span className="block text-sm font-black uppercase text-gray-500 mb-1">Price per night</span>
                <span className="text-5xl font-display font-black text-pop-black">₹{room.roomPrice}</span>
              </div>

              {successMessage && (
                <div className="bg-pop-mint text-pop-black p-4 border-2 border-pop-black mb-6 font-bold flex items-center shadow-neo-sm">
                  <Check className="w-5 h-5 mr-2" />
                  {successMessage}
                </div>
              )}

              {error && (
                <div className="bg-red-100 text-red-600 p-4 border-2 border-red-500 mb-6 font-bold shadow-neo-sm">
                  {error}
                </div>
              )}

              {isAuthenticated ? (
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black uppercase mb-1 ml-1">Check In</label>
                      <input
                        type="date"
                        name="checkInDate"
                        required
                        value={bookingData.checkInDate}
                        onChange={handleBookingChange}
                        className="w-full p-3 bg-gray-50 border-2 border-pop-black font-bold focus:outline-none focus:bg-pop-yellow/20 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase mb-1 ml-1">Check Out</label>
                      <input
                        type="date"
                        name="checkOutDate"
                        required
                        value={bookingData.checkOutDate}
                        onChange={handleBookingChange}
                        className="w-full p-3 bg-gray-50 border-2 border-pop-black font-bold focus:outline-none focus:bg-pop-yellow/20 transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase mb-1 ml-1">Adults</label>
                        <input
                          type="number"
                          name="numOfAdults"
                          min="1"
                          required
                          value={bookingData.numOfAdults}
                          onChange={handleBookingChange}
                          className="w-full p-3 bg-gray-50 border-2 border-pop-black font-bold focus:outline-none focus:bg-pop-yellow/20 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase mb-1 ml-1">Children</label>
                        <input
                          type="number"
                          name="numOfChildren"
                          min="0"
                          value={bookingData.numOfChildren}
                          onChange={handleBookingChange}
                          className="w-full p-3 bg-gray-50 border-2 border-pop-black font-bold focus:outline-none focus:bg-pop-yellow/20 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className={`w-full bg-pop-pink text-pop-black text-xl font-black uppercase py-4 border-3 border-pop-black shadow-neo hover:bg-pop-yellow hover:shadow-neo-lg hover:-translate-y-1 transition-all ${bookingLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {bookingLoading ? 'Processing...' : 'Book Now'}
                  </button>
                  <p className="text-xs text-center font-bold text-gray-400 mt-4 uppercase">You won't be charged yet</p>
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 font-bold mb-6">Sign in to book your stay.</p>
                  <button
                    onClick={() => navigate('/login', { state: { from: `/rooms/${room.id}` } })}
                    className="w-full bg-pop-black text-white font-black uppercase py-4 border-3 border-pop-black shadow-neo hover:bg-pop-blue hover:text-pop-black transition-all"
                  >
                    Login to Book
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoomDetails;