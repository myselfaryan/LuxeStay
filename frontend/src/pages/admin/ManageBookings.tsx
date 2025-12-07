import React, { useEffect, useState } from 'react';
import { ApiService } from '../../services/apiService';
import { BookingDTO } from '../../types';
import { Trash2, Calendar, Users, CheckCircle, Clock } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';

const ManageBookings: React.FC = () => {
    const [bookings, setBookings] = useState<BookingDTO[]>([]);
    const [loading, setLoading] = useState(true);

    // Confirmation Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await ApiService.getAllBookings();
            if (response.bookingList) {
                setBookings(response.bookingList);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const initiateCancel = (id: number) => {
        setBookingToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleCancelConfirm = async () => {
        if (!bookingToDelete) return;
        try {
            await ApiService.cancelBooking(bookingToDelete);
            fetchBookings();
        } catch (error) {
            alert('Failed to cancel booking');
        }
    };

    // Stats calculation
    const totalBookings = bookings.length;
    const totalGuests = bookings.reduce((acc, curr) => acc + curr.totalNumOfGuest, 0);

    return (
        <div className="min-h-screen bg-pop-purple pb-12 pt-24 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12">
                    <div className="inline-block bg-pop-yellow border-2 border-pop-black shadow-neo px-4 py-1 transform -rotate-2 mb-4">
                        <span className="font-black uppercase tracking-widest text-xs">Admin Zone</span>
                    </div>
                    <h1 className="text-5xl font-display font-black uppercase text-pop-black">Booking Overview</h1>
                    <p className="text-xl font-bold text-gray-800 mt-2">Track reservations and guest statistics.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 border-3 border-pop-black shadow-neo flex items-center space-x-4 transform rotate-1 hover:rotate-0 transition-transform">
                        <div className="p-4 bg-pop-blue border-2 border-pop-black text-pop-black">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-gray-500 tracking-wider">Total Bookings</p>
                            <p className="text-3xl font-black text-pop-black">{totalBookings}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 border-3 border-pop-black shadow-neo flex items-center space-x-4 transform -rotate-1 hover:rotate-0 transition-transform">
                        <div className="p-4 bg-pop-mint border-2 border-pop-black text-pop-black">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-gray-500 tracking-wider">Total Guests</p>
                            <p className="text-3xl font-black text-pop-black">{totalGuests}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 border-3 border-pop-black shadow-neo flex items-center space-x-4 transform rotate-1 hover:rotate-0 transition-transform">
                        <div className="p-4 bg-pop-pink border-2 border-pop-black text-pop-black">
                            <Clock className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-gray-500 tracking-wider">Active Reservations</p>
                            <p className="text-3xl font-black text-pop-black">{totalBookings}</p>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border-3 border-pop-black shadow-neo-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y-3 divide-pop-black">
                            <thead className="bg-pop-yellow">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black text-pop-black uppercase tracking-wider border-r-2 border-pop-black">Confirmation</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-pop-black uppercase tracking-wider border-r-2 border-pop-black">Guest & Room</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-pop-black uppercase tracking-wider border-r-2 border-pop-black">Schedule</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-pop-black uppercase tracking-wider border-r-2 border-pop-black">Party Size</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-pop-black uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y-2 divide-gray-200">
                                {loading && (
                                    <tr><td colSpan={5} className="p-8 text-center text-xl font-black uppercase animate-pulse">Loading bookings...</td></tr>
                                )}

                                {!loading && bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center">
                                            <div className="inline-block p-4 bg-gray-100 border-3 border-pop-black rounded-full mb-4">
                                                <Calendar className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-xl font-black uppercase text-gray-400">No bookings found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap border-r-2 border-gray-200">
                                                <span className="inline-flex items-center px-3 py-1 bg-pop-blue text-pop-black font-mono text-sm font-bold border-2 border-pop-black shadow-neo-sm transform -rotate-1">
                                                    {booking.bookingConfirmationCode}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 border-r-2 border-gray-200">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black uppercase text-pop-black">{booking.room?.roomType}</span>
                                                    <span className="text-xs font-bold text-gray-500">{booking.user?.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap border-r-2 border-gray-200">
                                                <div className="flex flex-col space-y-1">
                                                    <div className="text-xs font-black uppercase text-gray-500">In: <span className="text-pop-black font-bold">{booking.checkInDate}</span></div>
                                                    <div className="text-xs font-black uppercase text-gray-500">Out: <span className="text-pop-black font-bold">{booking.checkOutDate}</span></div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap border-r-2 border-gray-200">
                                                <div className="flex items-center space-x-2 text-sm font-bold text-gray-600">
                                                    <Users className="w-4 h-4" />
                                                    <span>{booking.totalNumOfGuest}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => initiateCancel(booking.id)}
                                                    className="group flex items-center justify-end w-full text-red-600 hover:text-red-900"
                                                    title="Cancel Booking"
                                                >
                                                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-black uppercase">Cancel</span>
                                                    <div className="p-2 bg-red-100 border-2 border-transparent group-hover:border-pop-black group-hover:shadow-neo-sm transition-all rounded-none">
                                                        <Trash2 className="h-4 w-4" />
                                                    </div>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleCancelConfirm}
                    title="Cancel Booking"
                    message="Are you sure you want to cancel this booking? This action cannot be undone."
                />
            </div>
        </div>
    );
};

export default ManageBookings;