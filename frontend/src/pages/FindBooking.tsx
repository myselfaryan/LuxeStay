import React, { useState } from 'react';
import { ApiService } from '../services/apiService';
import { BookingDTO } from '../types';
import { Search, Calendar, User, CheckCircle, AlertCircle } from 'lucide-react';

const FindBooking: React.FC = () => {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [booking, setBooking] = useState<BookingDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirmationCode.trim()) return;

        setLoading(true);
        setError('');
        setBooking(null);

        try {
            const response = await ApiService.getBookingByConfirmationCode(confirmationCode);
            if (response.statusCode === 200 && response.booking) {
                setBooking(response.booking);
            } else {
                setError(response.message || 'Booking not found');
            }
        } catch (err: any) {
            setError(err.message || 'Error finding booking. Please check the code and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center py-24 px-4 sm:px-6 lg:px-8 bg-pop-purple font-sans">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="inline-block bg-pop-yellow border-2 border-pop-black shadow-neo px-4 py-1 transform rotate-2 mb-4">
                        <span className="font-black uppercase tracking-widest text-xs">Lost?</span>
                    </div>
                    <h2 className="text-4xl font-display font-black uppercase text-pop-black">
                        Find Your Booking
                    </h2>
                    <p className="mt-2 text-lg font-bold text-gray-800">
                        Enter your confirmation code to track it down.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSearch}>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="confirmation-code"
                            name="code"
                            type="text"
                            required
                            className="block w-full pl-11 pr-4 py-4 bg-white border-3 border-pop-black font-bold text-pop-black placeholder-gray-400 focus:outline-none focus:bg-pop-yellow/20 transition-all shadow-neo"
                            placeholder="Confirmation Code (e.g. ABC123456)"
                            value={confirmationCode}
                            onChange={(e) => setConfirmationCode(e.target.value)}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-4 px-4 border-3 border-pop-black text-xl font-black uppercase text-pop-black bg-pop-mint hover:bg-pop-pink transition-all shadow-neo hover:shadow-neo-lg hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Searching...' : 'Find Booking'}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="bg-red-100 border-3 border-red-500 text-red-600 px-4 py-3 font-bold shadow-neo-sm flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}
            </div>

            {booking && (
                <div className="mt-12 w-full max-w-2xl bg-white border-3 border-pop-black shadow-neo-lg overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-300">
                    <div className="px-6 py-6 bg-pop-yellow border-b-3 border-pop-black flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-black uppercase text-pop-black">
                                Booking Details
                            </h3>
                            <p className="mt-1 text-sm font-bold text-gray-700">
                                Code: <span className="font-mono text-pop-black bg-white px-2 border border-pop-black">{booking.bookingConfirmationCode}</span>
                            </p>
                        </div>
                        <div className="px-3 py-1 bg-pop-mint border-2 border-pop-black text-pop-black text-xs font-black uppercase shadow-neo-sm">
                            Confirmed
                        </div>
                    </div>

                    <div className="p-6 space-y-6">

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 border-2 border-pop-black shadow-neo-sm">
                                <span className="block text-xs font-black uppercase text-gray-500 mb-1">Check-in</span>
                                <div className="flex items-center font-bold text-pop-black">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {booking.checkInDate}
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 border-2 border-pop-black shadow-neo-sm">
                                <span className="block text-xs font-black uppercase text-gray-500 mb-1">Check-out</span>
                                <div className="flex items-center font-bold text-pop-black">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {booking.checkOutDate}
                                </div>
                            </div>
                        </div>

                        {/* Guests */}
                        <div className="bg-gray-50 p-4 border-2 border-pop-black shadow-neo-sm flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-gray-500">Guests</span>
                            <span className="font-bold text-pop-black">{booking.totalNumOfGuest} Total ({booking.numOfAdults} Adults, {booking.numOfChildren} Children)</span>
                        </div>

                        {/* Room Info */}
                        {booking.room && (
                            <div className="bg-gray-50 p-4 border-2 border-pop-black shadow-neo-sm">
                                <span className="block text-xs font-black uppercase text-gray-500 mb-3">Room Info</span>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {booking.room.roomPhotoUrl && (
                                        <img
                                            src={booking.room.roomPhotoUrl}
                                            alt="Room"
                                            className="w-full sm:w-32 h-24 object-cover border-2 border-pop-black"
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'; }}
                                        />
                                    )}
                                    <div>
                                        <div className="font-black uppercase text-lg text-pop-black">{booking.room.roomType}</div>
                                        <div className="text-pop-blue font-bold mt-1">₹{booking.room.roomPrice} <span className="text-gray-500 font-normal text-xs">/ night</span></div>
                                        <div className="text-gray-600 text-xs mt-2 font-medium line-clamp-2">{booking.room.roomDescription}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* User Info */}
                        {booking.user && (
                            <div className="bg-gray-50 p-4 border-2 border-pop-black shadow-neo-sm flex items-center">
                                <div className="h-10 w-10 bg-pop-pink border-2 border-pop-black flex items-center justify-center mr-4">
                                    <User className="h-5 w-5 text-pop-black" />
                                </div>
                                <div>
                                    <p className="font-bold text-pop-black">{booking.user.name}</p>
                                    <p className="text-xs font-bold text-gray-500 uppercase">{booking.user.email}</p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
};
export default FindBooking;