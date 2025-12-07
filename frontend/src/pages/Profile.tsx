import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/apiService';
import { BookingDTO, UserDTO } from '../types';
import { Trash2, Calendar, MapPin, Phone, Mail, User, Clock, CheckCircle, AlertCircle, LogOut, Shield } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

const Profile: React.FC = () => {
    const { user: authUser, logout } = useAuth();
    const [profile, setProfile] = useState<UserDTO | null>(null);
    const [bookings, setBookings] = useState<BookingDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);

    const fetchProfileData = async () => {
        try {
            // Fetch full profile info
            const userResponse = await ApiService.getUserProfile();
            if (userResponse.user) {
                setProfile(userResponse.user);

                // Fetch bookings
                if (userResponse.user.bookings && userResponse.user.bookings.length > 0) {
                    setBookings(userResponse.user.bookings);
                } else {
                    // Fallback to fetch specific history if empty
                    const bookingResponse = await ApiService.getUserBookings(userResponse.user.id.toString());
                    if (bookingResponse.bookingList) {
                        setBookings(bookingResponse.bookingList);
                    }
                }
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const initiateCancel = (bookingId: number) => {
        setBookingToDelete(bookingId);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmCancel = async () => {
        if (!bookingToDelete) return;

        try {
            await ApiService.cancelBooking(bookingToDelete);
            // Refresh bookings
            fetchProfileData();
        } catch (err: any) {
            alert(err.message || "Failed to cancel booking");
        }
    };

    const getBookingStatus = (checkIn: string, checkOut: string) => {
        const now = new Date();
        const start = new Date(checkIn);
        const end = new Date(checkOut);

        if (now > end) return { label: 'Completed', color: 'bg-gray-200 text-gray-500 border-gray-400', icon: CheckCircle };
        if (now < start) return { label: 'Upcoming', color: 'bg-pop-yellow text-pop-black border-pop-black', icon: Calendar };
        return { label: 'Active', color: 'bg-pop-mint text-pop-black border-pop-black', icon: Clock };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-pop-purple flex items-center justify-center">
                <div className="text-4xl font-black uppercase text-pop-black animate-bounce">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-pop-purple pb-20 pt-24">

            {/* Header Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
                <div className="inline-block bg-pop-mint border-2 border-pop-black shadow-neo px-4 py-1 transform -rotate-2 mb-4">
                    <span className="font-black uppercase tracking-widest text-xs">Member Area</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-black uppercase text-pop-black mb-2">My Dashboard</h1>
                <p className="text-xl font-bold text-gray-800">Welcome back, {profile?.name}</p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* User Info Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border-3 border-pop-black shadow-neo-lg relative overflow-hidden">

                            {/* Avatar */}
                            <div className="bg-pop-yellow border-b-3 border-pop-black p-8 flex justify-center">
                                <div className="h-32 w-32 bg-white border-3 border-pop-black shadow-neo flex items-center justify-center text-pop-black text-5xl font-black uppercase">
                                    {profile?.name?.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            {/* User Details */}
                            <div className="p-8 text-center">
                                <h2 className="text-3xl font-display font-black uppercase text-pop-black mb-2">{profile?.name}</h2>

                                <div className="inline-flex items-center text-xs font-black uppercase tracking-wide bg-pop-black text-white px-3 py-1 mb-8">
                                    <Shield className="w-4 h-4 mr-1 text-pop-yellow" />
                                    <span>{profile?.role} Account</span>
                                </div>

                                <div className="space-y-4 text-left">
                                    {/* Email */}
                                    <div className="flex items-center p-4 bg-gray-50 border-2 border-pop-black shadow-neo-sm">
                                        <div className="h-10 w-10 bg-pop-pink border-2 border-pop-black flex items-center justify-center text-pop-black mr-4">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-xs font-black uppercase text-gray-500">Email</p>
                                            <p className="text-sm font-bold text-pop-black truncate">{profile?.email}</p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-center p-4 bg-gray-50 border-2 border-pop-black shadow-neo-sm">
                                        <div className="h-10 w-10 bg-pop-blue border-2 border-pop-black flex items-center justify-center text-pop-black mr-4">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase text-gray-500">Phone</p>
                                            <p className="text-sm font-bold text-pop-black">{profile?.phoneNumber || "Not Provided"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Logout Button */}
                                <div className="mt-10 pt-6 border-t-3 border-pop-black">
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center justify-center space-x-2 bg-red-400 text-white border-3 border-pop-black shadow-neo py-3 font-black uppercase hover:bg-red-500 hover:shadow-neo-lg hover:-translate-y-1 transition-all"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Booking History */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6 bg-white border-3 border-pop-black p-4 shadow-neo">
                            <h2 className="text-2xl font-black uppercase text-pop-black">Your Stays</h2>
                            <span className="bg-pop-black text-white px-4 py-1 font-black text-sm uppercase">
                                {bookings.length} Bookings
                            </span>
                        </div>

                        {error && <div className="bg-red-100 text-red-600 p-4 border-2 border-red-500 font-bold shadow-neo-sm mb-6 flex items-center"><AlertCircle className="w-5 h-5 mr-2" />{error}</div>}

                        {bookings.length === 0 ? (
                            <div className="bg-white border-3 border-pop-black shadow-neo p-12 text-center flex flex-col items-center">
                                <div className="h-20 w-20 bg-gray-100 border-3 border-pop-black rounded-full flex items-center justify-center mb-6">
                                    <Calendar className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-black uppercase text-pop-black mb-2">No bookings yet</h3>
                                <p className="max-w-xs mx-auto text-gray-600 font-bold">You haven't made any reservations. Go find a crib!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {bookings.map((booking) => {
                                    const status = getBookingStatus(booking.checkInDate, booking.checkOutDate);
                                    const StatusIcon = status.icon;

                                    return (
                                        <div key={booking.id} className="bg-white border-3 border-pop-black shadow-neo hover:shadow-neo-lg transition-all group flex flex-col sm:flex-row overflow-hidden">
                                            {/* Room Image (Left) */}
                                            <div className="sm:w-48 h-48 sm:h-auto relative border-b-3 sm:border-b-0 sm:border-r-3 border-pop-black">
                                                <img
                                                    src={booking.room?.roomPhotoUrl || 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
                                                    alt={booking.room?.roomType}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'; }}
                                                />
                                                <div className="absolute top-2 left-2">
                                                    <div className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-black uppercase border-2 border-pop-black shadow-neo-sm ${status.color}`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        <span>{status.label}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content (Right) */}
                                            <div className="p-6 flex flex-col justify-between flex-grow">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-2xl font-display font-black uppercase text-pop-black mb-1 leading-none">
                                                            {booking.room ? booking.room.roomType : `Room #${booking.room?.id}`}
                                                        </h3>
                                                        <p className="text-xs font-bold text-gray-500 uppercase">
                                                            Confirmation: <span className="text-pop-black bg-pop-yellow px-1 border border-pop-black">{booking.bookingConfirmationCode}</span>
                                                        </p>
                                                    </div>
                                                    <div className="text-right hidden sm:block">
                                                        <p className="text-xl font-black text-pop-black">₹{booking.room?.roomPrice}</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 border-t-2 border-dashed border-gray-300 pt-4 mb-4">
                                                    <div>
                                                        <p className="text-xs font-black uppercase text-gray-400">Check-in</p>
                                                        <p className="text-sm font-bold text-pop-black flex items-center mt-1">
                                                            <Calendar className="w-4 h-4 mr-2 text-pop-black" />
                                                            {booking.checkInDate}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black uppercase text-gray-400">Check-out</p>
                                                        <p className="text-sm font-bold text-pop-black flex items-center mt-1">
                                                            <Calendar className="w-4 h-4 mr-2 text-pop-black" />
                                                            {booking.checkOutDate}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <p className="text-sm font-bold text-gray-600">
                                                        <span className="font-black text-pop-black">{booking.totalNumOfGuest}</span> Guests
                                                    </p>

                                                    {status.label !== 'Completed' && (
                                                        <button
                                                            onClick={() => initiateCancel(booking.id)}
                                                            className="text-red-600 hover:text-white hover:bg-red-600 border-2 border-transparent hover:border-pop-black hover:shadow-neo-sm text-sm font-black uppercase flex items-center transition-all px-3 py-1.5"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1.5" /> Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmCancel}
                    title="Cancel Reservation"
                    message="Are you sure you want to cancel this reservation? This action cannot be undone and may be subject to cancellation fees."
                />
            </div>
        </div>
    );
};

export default Profile;