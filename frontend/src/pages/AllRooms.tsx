import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/apiService';
import RoomCard from '../components/RoomCard';
import { Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';

const AllRooms: React.FC = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(6);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await ApiService.getAllRooms();
        const allRooms = response.roomList;
        setRooms(allRooms);
        setFilteredRooms(allRooms);
        const types = [...new Set(allRooms.map((room: any) => room.roomType))];
        setRoomTypes(types);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    let result = rooms;
    if (selectedRoomType) {
      result = result.filter((room: any) => room.roomType === selectedRoomType);
    }
    if (searchTerm) {
      result = result.filter((room: any) => room.roomType.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredRooms(result);
    setCurrentPage(1);
  }, [selectedRoomType, searchTerm, rooms]);

  // Pagination
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-pop-purple pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans text-pop-black">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-pop-yellow border-2 border-pop-black shadow-neo px-4 py-1 transform -rotate-2 mb-4">
            <span className="font-black uppercase tracking-widest text-xs">Stay Fresh</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter text-pop-black mb-4">
            Pick Your Crib
          </h1>
          <p className="text-xl font-bold text-gray-800 max-w-2xl mx-auto">
            From cozy corners to penthouse suites, we've got the perfect spot for your next adventure.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white border-3 border-pop-black shadow-neo-lg p-6 mb-12 transform rotate-1 hover:rotate-0 transition-transform duration-300">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

            {/* Search */}
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-pop-black font-bold focus:outline-none focus:bg-pop-yellow/20 transition-colors"
              />
            </div>

            {/* Filter */}
            <div className="relative w-full md:w-1/4">
              <Filter className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <select
                value={selectedRoomType}
                onChange={(e) => setSelectedRoomType(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-gray-50 border-2 border-pop-black font-bold focus:outline-none focus:bg-pop-yellow/20 transition-colors appearance-none"
              >
                <option value="">All Types</option>
                {roomTypes.map((type: any, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute right-4 top-4 pointer-events-none">
                <ChevronLeft className="h-4 w-4 transform -rotate-90" />
              </div>
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedRoomType) && (
              <button
                onClick={() => { setSearchTerm(''); setSelectedRoomType(''); }}
                className="px-4 py-3 bg-red-400 text-white font-black uppercase border-2 border-pop-black shadow-neo hover:bg-red-500 transition-colors flex items-center"
              >
                <X className="h-5 w-5 mr-2" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentRooms.length > 0 ? (
            currentRooms.map((room: any) => (
              <RoomCard key={room.id} room={room} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white border-3 border-pop-black shadow-neo">
              <p className="text-2xl font-black uppercase text-gray-400">No rooms found matching your vibe.</p>
              <button onClick={() => { setSearchTerm(''); setSelectedRoomType(''); }} className="mt-4 text-pop-blue font-bold hover:underline">Clear filters</button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-3 border-2 border-pop-black font-black uppercase shadow-neo transition-all ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-white hover:bg-pop-yellow hover:-translate-y-1'}`}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`w-12 h-12 border-2 border-pop-black font-black text-lg shadow-neo transition-all ${currentPage === i + 1 ? 'bg-pop-pink text-pop-black -translate-y-1 shadow-neo-lg' : 'bg-white hover:bg-pop-yellow hover:-translate-y-1'}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-3 border-2 border-pop-black font-black uppercase shadow-neo transition-all ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-white hover:bg-pop-yellow hover:-translate-y-1'}`}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default AllRooms;