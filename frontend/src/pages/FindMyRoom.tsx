import React, { useState } from 'react';
import { ApiService } from '../services/apiService';
import { Sparkles, Search, ArrowRight, Loader2, ThumbsUp, Frown } from 'lucide-react';
import RoomCard from '../components/RoomCard';
import { RoomDTO } from '../types';

interface Recommendation {
    roomId: number;
    matchScore: number;
    reason: string;
}

const FindMyRoom: React.FC = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<{ room: RoomDTO, reason: string, score: number }[]>([]);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setRecommendations([]);
        setSearched(true);

        try {
            // 1. Get AI Recommendations
            const aiResponse = await ApiService.getRoomRecommendations(query);
            const aiData: { recommendations: Recommendation[] } = JSON.parse(aiResponse.message);

            if (aiData.recommendations && aiData.recommendations.length > 0) {
                // 2. Fetch full room details for recommended IDs
                const allRoomsResponse = await ApiService.getAllRooms();
                const allRooms: RoomDTO[] = allRoomsResponse.roomList;

                const enrichedRecommendations = aiData.recommendations.map(rec => {
                    const room = allRooms.find(r => r.id === rec.roomId);
                    return room ? { room, reason: rec.reason, score: rec.matchScore } : null;
                }).filter(item => item !== null) as { room: RoomDTO, reason: string, score: number }[];

                setRecommendations(enrichedRecommendations);
            }
        } catch (error) {
            console.error("Failed to get recommendations", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-pop-purple font-sans text-pop-black pb-20">
            {/* Hero Section */}
            <div className="bg-pop-yellow border-b-3 border-pop-black pt-32 pb-20 px-4 relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center justify-center px-4 py-2 bg-white border-2 border-pop-black shadow-neo mb-6 transform -rotate-2">
                        <Sparkles className="w-5 h-5 text-pop-black mr-2" />
                        <span className="text-sm font-black uppercase tracking-widest">AI Matchmaker</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-black uppercase mb-6 leading-tight text-pop-black">
                        Find Your <br />
                        <span className="text-white text-stroke-3 text-stroke-black">Perfect Vibe</span>
                    </h1>
                    <p className="text-xl font-bold text-gray-800 mb-10 max-w-2xl mx-auto">
                        Tell us what you're dreaming of—romantic escape, party weekend, or quiet retreat. Our AI will do the heavy lifting.
                    </p>

                    <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto transform rotate-1 hover:rotate-0 transition-transform duration-300">
                        <div className="relative flex items-center bg-white border-3 border-pop-black shadow-neo-lg p-2">
                            <Search className="w-8 h-8 text-pop-black ml-3" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="e.g., Romantic weekend with ocean view, budget under ₹15,000..."
                                className="w-full p-4 text-pop-black placeholder-gray-400 font-bold text-lg bg-transparent focus:outline-none"
                            />
                            <button
                                type="submit"
                                disabled={loading || !query.trim()}
                                className="bg-pop-black text-white p-4 border-2 border-pop-black hover:bg-pop-pink hover:text-pop-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-black uppercase shadow-neo"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-20 left-10 w-16 h-16 bg-pop-mint rounded-full border-3 border-pop-black animate-bounce-slow hidden md:block"></div>
                <div className="absolute bottom-10 right-10 w-24 h-24 bg-pop-pink rotate-12 border-3 border-pop-black hidden md:block"></div>
            </div>

            {/* Results Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-20">
                {searched && !loading && recommendations.length === 0 && (
                    <div className="bg-white border-3 border-pop-black shadow-neo-lg p-12 text-center max-w-lg mx-auto transform rotate-1">
                        <div className="w-20 h-20 bg-gray-100 border-3 border-pop-black rounded-full flex items-center justify-center mx-auto mb-6">
                            <Frown className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-display font-black uppercase text-pop-black mb-2">No matches found</h3>
                        <p className="text-gray-600 font-bold">We couldn't find a room that matches your vibe. Try adjusting your search.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-12">
                    {recommendations.map((rec, index) => (
                        <div key={rec.room.id} className="bg-white border-3 border-pop-black shadow-neo-lg overflow-hidden flex flex-col md:flex-row transform transition-all hover:-translate-y-2 duration-300">
                            {/* AI Insight Sidebar */}
                            <div className="md:w-1/3 bg-pop-blue border-b-3 md:border-b-0 md:border-r-3 border-pop-black p-8 flex flex-col justify-center relative">
                                <div className="absolute top-4 right-4 opacity-20">
                                    <Sparkles className="w-24 h-24 text-pop-black" />
                                </div>

                                <div className="relative z-10">
                                    <div className="inline-flex items-center space-x-2 bg-pop-mint text-pop-black px-4 py-2 border-2 border-pop-black shadow-neo-sm transform -rotate-2 mb-6">
                                        <ThumbsUp className="w-4 h-4" />
                                        <span className="font-black uppercase text-sm">{rec.score}% Match</span>
                                    </div>
                                    <h3 className="text-2xl font-display font-black uppercase text-pop-black mb-4">Why this fits</h3>
                                    <div className="bg-white p-6 border-2 border-pop-black shadow-neo-sm transform rotate-1">
                                        <p className="text-pop-black font-bold italic leading-relaxed">
                                            "{rec.reason}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Room Card Content */}
                            <div className="md:w-2/3 p-6 bg-white">
                                <div className="h-full">
                                    <RoomCard room={rec.room} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FindMyRoom;
