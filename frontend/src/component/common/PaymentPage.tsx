import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentIntent } from '@stripe/stripe-js';
import { ApiService } from '../../services/apiService';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, Lock } from 'lucide-react';

// Replace with your Stripe Publishable Key
const stripePromise = loadStripe('pk_test_51SYC5APy12dZTG3YxdxvXwNDA1YN53WI8mtZ8aJ9mIqI0agyhxzzYbj8NTBtfAyA0ZsqGrcXgrNfECoY97Zy1wAi00ZxWjifOD');

interface CheckoutFormProps {
    amount: number;
    onSuccess: (paymentIntent: any) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: window.location.origin + "/payment-success",
            },
            redirect: "if_required",
        });

        if (error) {
            setMessage(error.message || "An unexpected error occurred.");
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            setMessage("Payment succeeded!");
            onSuccess(paymentIntent);
        } else {
            setMessage("Unexpected state");
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-white p-8 border-3 border-pop-black shadow-neo-lg transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center p-4 bg-pop-yellow border-2 border-pop-black shadow-neo mb-4 rounded-full">
                    <Lock className="h-6 w-6 text-pop-black" />
                </div>
                <h2 className="text-3xl font-display font-black uppercase text-pop-black">Secure Payment</h2>
                <p className="text-gray-600 font-bold mt-2">Don't worry, it's safe.</p>
            </div>

            <PaymentElement />

            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full mt-8 bg-pop-black text-white font-black uppercase py-4 border-3 border-pop-black shadow-neo hover:bg-pop-blue hover:text-pop-black hover:shadow-neo-lg hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
                <span id="button-text">
                    {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : `Pay ₹${amount}`}
                </span>
            </button>

            {message && (
                <div className="mt-6 p-4 bg-red-100 text-red-600 border-2 border-red-500 font-bold shadow-neo-sm text-center">
                    {message}
                </div>
            )}
        </form>
    );
};

const PaymentPage: React.FC = () => {
    const [clientSecret, setClientSecret] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingDetails, roomPrice } = location.state || {};

    useEffect(() => {
        if (roomPrice) {
            fetch("http://localhost:8080/payments/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
                body: JSON.stringify({ amount: roomPrice }),
            })
                .then((res) => res.json())
                .then((data) => setClientSecret(data.clientSecret));
        }
    }, [roomPrice]);

    const handlePaymentSuccess = async (paymentIntent: any) => {
        try {
            const response = await ApiService.bookRoom(bookingDetails.roomId, bookingDetails.userId, bookingDetails);
            if (response.statusCode === 200) {
                navigate('/booking-success', { state: { message: "Booking Successful!", confirmationCode: response.bookingConfirmationCode } });
            } else {
                navigate('/booking-failure', { state: { error: response.message } });
            }
        } catch (error) {
            console.error("Booking failed after payment", error);
        }
    };

    const appearance = {
        theme: 'stripe' as const,
        variables: {
            colorPrimary: '#121212',
            colorBackground: '#ffffff',
            colorText: '#121212',
            fontFamily: '"Space Grotesk", sans-serif',
            borderRadius: '0px',
        },
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="min-h-screen bg-pop-purple flex flex-col justify-center items-center p-4 font-sans">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Side - Summary */}
                <div className="hidden lg:block space-y-8">
                    <div className="inline-block bg-pop-mint border-2 border-pop-black shadow-neo px-4 py-1 transform -rotate-2 mb-2">
                        <span className="font-black uppercase tracking-widest text-xs">Almost There</span>
                    </div>
                    <h1 className="text-6xl font-display font-black uppercase text-pop-black leading-none">
                        Seal The <br />
                        <span className="text-white text-stroke-3 text-stroke-black">Deal.</span>
                    </h1>
                    <p className="text-xl font-bold text-gray-800 border-l-4 border-pop-black pl-4">
                        You are just one step away from the ultimate crib.
                    </p>
                    <div className="bg-white p-8 border-3 border-pop-black shadow-neo transform rotate-1">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-500 font-black uppercase text-sm">Total Amount</span>
                            <span className="text-4xl font-black text-pop-black">₹{roomPrice}</span>
                        </div>
                        <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <Lock className="h-4 w-4 mr-2" /> Secure SSL Encryption
                        </div>
                    </div>
                </div>

                {/* Right Side - Payment Form */}
                <div className="w-full">
                    {clientSecret ? (
                        <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm amount={roomPrice} onSuccess={handlePaymentSuccess} />
                        </Elements>
                    ) : (
                        <div className="flex justify-center flex-col items-center">
                            <Loader2 className="animate-spin h-12 w-12 text-pop-black mb-4" />
                            <p className="font-black uppercase text-pop-black">Loading Payment Gateway...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
