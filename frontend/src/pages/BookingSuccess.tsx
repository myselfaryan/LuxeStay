import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader } from 'lucide-react';

interface LocationState {
    message?: string;
    confirmationCode?: string;
}

const BookingSuccess: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { message, confirmationCode } = (location.state as LocationState) || {};
    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        // Simulate a processing delay for the "spin up" effect
        const timer = setTimeout(() => {
            setShowSpinner(false);
        }, 2000);

        // Redirect to "My Bookings" after showing the success message
        const redirectTimer = setTimeout(() => {
            navigate('/profile'); // Assuming profile page has "My Bookings"
        }, 5000);

        return () => {
            clearTimeout(timer);
            clearTimeout(redirectTimer);
        };
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-pop-purple px-4 font-sans">
            <div className="bg-white p-8 border-3 border-pop-black shadow-neo-lg max-w-md w-full text-center transform rotate-1 hover:rotate-0 transition-transform duration-500">
                {showSpinner ? (
                    <div className="flex flex-col items-center space-y-4">
                        <Loader className="w-16 h-16 text-pop-black animate-spin" />
                        <h2 className="text-3xl font-black uppercase text-pop-black">Locking it in...</h2>
                        <p className="text-gray-600 font-bold">Hold tight while we secure your crib.</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-6 animate-fade-in-up">
                        <div className="rounded-full bg-pop-mint border-3 border-pop-black p-4 shadow-neo">
                            <CheckCircle className="w-16 h-16 text-pop-black" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-4xl font-display font-black uppercase text-pop-black">You're In!</h1>
                            <p className="text-xl font-bold text-gray-800">Get ready to live large.</p>
                        </div>

                        {confirmationCode && (
                            <div className="bg-pop-yellow border-3 border-pop-black shadow-neo p-4 w-full transform -rotate-1">
                                <p className="text-xs font-black uppercase text-pop-black mb-1">Confirmation Code</p>
                                <p className="text-3xl font-mono font-black text-pop-black tracking-wider">{confirmationCode}</p>
                            </div>
                        )}

                        <p className="text-sm font-bold text-gray-500 uppercase">
                            Redirecting to your dashboard...
                        </p>

                        <button
                            onClick={() => navigate('/profile')}
                            className="w-full bg-pop-black text-white font-black uppercase py-4 border-3 border-pop-black shadow-neo hover:bg-pop-blue hover:text-pop-black hover:shadow-neo-lg hover:-translate-y-1 transition-all"
                        >
                            See My Bookings
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingSuccess;
