import React, { useEffect, useState } from 'react';
import { ApiService } from '../../services/apiService';
import { RoomDTO } from '../../types';
import { ROOM_TYPES } from '../../constants';
import { Trash2, Edit, Plus, X, Box, DollarSign, Layers, Image as ImageIcon } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';

const ManageRooms: React.FC = () => {
  const [rooms, setRooms] = useState<RoomDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<number | null>(null);

  // Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<number | null>(null);

  // Form State
  const [roomType, setRoomType] = useState('');
  const [roomPrice, setRoomPrice] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getAllRooms();
      if (response.roomList) {
        setRooms(response.roomList);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const initiateDelete = (id: number) => {
    setRoomToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!roomToDelete) return;
    try {
      await ApiService.deleteRoom(roomToDelete);
      fetchRooms();
    } catch (error) {
      alert('Failed to delete room');
    }
  };

  const handleOpenModal = (room?: RoomDTO) => {
    if (room) {
      setEditingRoomId(room.id);
      setRoomType(room.roomType);
      setRoomPrice(room.roomPrice.toString());
      setRoomDescription(room.roomDescription);
    } else {
      setEditingRoomId(null);
      setRoomType(ROOM_TYPES[0]);
      setRoomPrice('');
      setRoomDescription('');
    }
    setFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('roomType', roomType);
    formData.append('roomPrice', roomPrice);
    formData.append('roomDescription', roomDescription);
    if (file) {
      formData.append('photo', file);
    }

    try {
      if (editingRoomId) {
        await ApiService.updateRoom(editingRoomId, formData);
      } else {
        await ApiService.addRoom(formData);
      }
      handleCloseModal();
      fetchRooms();
    } catch (error: any) {
      alert(error.message || 'Operation failed');
    }
  };

  // Stats Calculation
  const totalRooms = rooms.length;
  const avgPrice = totalRooms > 0 ? (rooms.reduce((acc, r) => acc + r.roomPrice, 0) / totalRooms).toFixed(2) : 0;
  const totalTypes = new Set(rooms.map(r => r.roomType)).size;

  return (
    <div className="min-h-screen bg-pop-purple pb-12 pt-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <div className="inline-block bg-pop-yellow border-2 border-pop-black shadow-neo px-4 py-1 transform -rotate-2 mb-4">
              <span className="font-black uppercase tracking-widest text-xs">Admin Zone</span>
            </div>
            <h1 className="text-5xl font-display font-black uppercase text-pop-black">Room Management</h1>
            <p className="text-xl font-bold text-gray-800 mt-2">Oversee hotel inventory and pricing.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-pop-mint text-pop-black px-6 py-4 font-black uppercase border-3 border-pop-black shadow-neo hover:bg-pop-pink hover:shadow-neo-lg hover:-translate-y-1 transition-all flex items-center"
          >
            <Plus className="h-6 w-6 mr-2" />
            Add New Room
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 border-3 border-pop-black shadow-neo flex items-center space-x-4 transform rotate-1 hover:rotate-0 transition-transform">
            <div className="p-4 bg-pop-blue border-2 border-pop-black text-pop-black">
              <Box className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-gray-500 tracking-wider">Total Rooms</p>
              <p className="text-3xl font-black text-pop-black">{totalRooms}</p>
            </div>
          </div>
          <div className="bg-white p-6 border-3 border-pop-black shadow-neo flex items-center space-x-4 transform -rotate-1 hover:rotate-0 transition-transform">
            <div className="p-4 bg-pop-green border-2 border-pop-black text-pop-black">
              <DollarSign className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-gray-500 tracking-wider">Avg. Price</p>
              <p className="text-3xl font-black text-pop-black">₹{avgPrice}</p>
            </div>
          </div>
          <div className="bg-white p-6 border-3 border-pop-black shadow-neo flex items-center space-x-4 transform rotate-1 hover:rotate-0 transition-transform">
            <div className="p-4 bg-pop-pink border-2 border-pop-black text-pop-black">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-gray-500 tracking-wider">Room Types</p>
              <p className="text-3xl font-black text-pop-black">{totalTypes}</p>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white border-3 border-pop-black shadow-neo-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-3 divide-pop-black">
              <thead className="bg-pop-yellow">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-pop-black uppercase tracking-wider border-r-2 border-pop-black">Room Detail</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-pop-black uppercase tracking-wider border-r-2 border-pop-black">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-pop-black uppercase tracking-wider border-r-2 border-pop-black">Price / Night</th>
                  <th className="px-6 py-4 text-right text-xs font-black text-pop-black uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y-2 divide-gray-200">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap border-r-2 border-gray-200">
                      <div className="flex items-center">
                        <div className="h-16 w-24 flex-shrink-0 overflow-hidden border-2 border-pop-black shadow-neo-sm">
                          <img
                            className="h-full w-full object-cover"
                            src={room.roomPhotoUrl}
                            alt=""
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80'; }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-black uppercase text-pop-black">{room.roomType}</div>
                          <div className="text-xs font-bold text-gray-500">ID: {room.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r-2 border-gray-200">
                      <p className="text-sm font-bold text-gray-600 max-w-xs truncate">{room.roomDescription}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-r-2 border-gray-200">
                      <span className="px-3 py-1 inline-flex text-sm leading-5 font-black rounded-none bg-pop-blue text-pop-black border-2 border-pop-black shadow-neo-sm">
                        ₹{room.roomPrice}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleOpenModal(room)}
                          className="p-2 text-pop-black hover:bg-pop-yellow border-2 border-transparent hover:border-pop-black hover:shadow-neo-sm transition-all"
                          title="Edit Room"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => initiateDelete(room.id)}
                          className="p-2 text-red-600 hover:bg-red-100 border-2 border-transparent hover:border-pop-black hover:shadow-neo-sm transition-all"
                          title="Delete Room"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {loading && (
            <div className="p-8 text-center text-xl font-black uppercase animate-pulse">Loading rooms...</div>
          )}
          {!loading && rooms.length === 0 && (
            <div className="p-12 text-center">
              <div className="inline-block p-4 bg-gray-100 border-3 border-pop-black rounded-full mb-4">
                <Box className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-xl font-black uppercase text-gray-400">No rooms found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-pop-black/80 backdrop-blur-sm" onClick={handleCloseModal}></div>

          <div className="relative bg-white border-3 border-pop-black shadow-neo-lg w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b-3 border-pop-black flex justify-between items-center bg-pop-yellow">
              <h3 className="text-xl font-black uppercase text-pop-black">{editingRoomId ? 'Edit Room' : 'Add New Room'}</h3>
              <button onClick={handleCloseModal} className="text-pop-black hover:text-white transition-colors">
                <X className="h-8 w-8" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Room Type</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="block w-full border-2 border-pop-black font-bold bg-gray-50 p-3 text-sm focus:outline-none focus:bg-pop-yellow/20"
                    required
                  >
                    <option value="" disabled>Select Type</option>
                    {ROOM_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Price / Night</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-bold">₹</span>
                    </div>
                    <input
                      type="number"
                      value={roomPrice}
                      onChange={(e) => setRoomPrice(e.target.value)}
                      className="block w-full pl-7 border-2 border-pop-black font-bold bg-gray-50 p-3 text-sm focus:outline-none focus:bg-pop-yellow/20"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                  rows={4}
                  className="block w-full border-2 border-pop-black font-bold bg-gray-50 p-3 text-sm focus:outline-none focus:bg-pop-yellow/20"
                  placeholder="Describe the room amenities, view, and features..."
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Room Image</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-pop-black border-dashed hover:bg-gray-50 transition-colors cursor-pointer relative bg-white">
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label className="relative cursor-pointer bg-transparent font-bold text-pop-blue hover:text-pop-black focus-within:outline-none">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                          required={!editingRoomId}
                        />
                      </label>
                    </div>
                    <p className="text-xs font-bold text-gray-500">PNG, JPG up to 10MB</p>
                    {file && (
                      <p className="text-sm text-green-600 font-black mt-2">Selected: {file.name}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 border-2 border-pop-black font-black uppercase text-gray-700 hover:bg-gray-100 transition-colors shadow-neo hover:shadow-none hover:translate-y-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-pop-black text-white font-black uppercase border-2 border-pop-black shadow-neo hover:bg-pop-blue hover:text-pop-black hover:shadow-neo-lg hover:-translate-y-1 transition-all"
                >
                  {editingRoomId ? 'Save Changes' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Room"
        message="Are you sure you want to delete this room? This action cannot be undone."
      />
    </div>
  );
};

export default ManageRooms;