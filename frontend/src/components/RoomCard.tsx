import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RoomDTO } from '../types';
import { Star, Users, ArrowRight } from 'lucide-react';

interface RoomCardProps {
  room: RoomDTO;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const navigate = useNavigate();

  return (
    <div className="group bg-white border-3 border-pop-black shadow-neo hover:shadow-neo-lg hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
      <div className="relative h-64 overflow-hidden border-b-3 border-pop-black">
        <img
          src={room.roomPhotoUrl}
          alt={room.roomType}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-pop-yellow text-pop-black px-3 py-1 font-black uppercase text-sm border-2 border-pop-black shadow-neo-sm transform rotate-2 group-hover:rotate-0 transition-transform">
          ₹{room.roomPrice} / Night
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-display font-black uppercase leading-tight">{room.roomType}</h3>
          <div className="flex items-center space-x-1 bg-pop-mint px-2 py-1 border-2 border-pop-black shadow-neo-sm transform -rotate-1">
            <Star className="w-4 h-4 fill-current text-pop-black" />
            <span className="font-bold text-sm">4.8</span>
          </div>
        </div>

        <p className="text-gray-600 font-medium mb-6 line-clamp-2 flex-grow">
          {room.roomDescription}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-gray-100">
          <div className="flex items-center text-gray-500 font-bold">
            <Users className="w-5 h-5 mr-2" />
            <span>2 Guests</span>
          </div>
          <button
            onClick={() => navigate(`/rooms/${room.id}`)}
            className="flex items-center px-4 py-2 bg-pop-pink text-pop-black font-black uppercase border-2 border-pop-black shadow-neo hover:bg-pop-blue hover:shadow-neo-lg hover:-translate-y-1 transition-all"
          >
            View Details <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;