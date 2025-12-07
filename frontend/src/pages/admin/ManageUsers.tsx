import React, { useEffect, useState } from 'react';
import { ApiService } from '../../services/apiService';
import { UserDTO } from '../../types';
import { Trash2, User, Shield, Users } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getAllUsers();
      if (response.userList) {
        setUsers(response.userList);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const initiateDelete = (id: number) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      await ApiService.deleteUser(userToDelete.toString());
      fetchUsers();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  // Stats
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const regularUsers = users.filter(u => u.role === 'USER').length;

  return (
    <div className="min-h-screen bg-pop-purple pb-12 pt-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <div className="inline-block bg-pop-yellow border-2 border-pop-black shadow-neo px-4 py-1 transform -rotate-2 mb-4">
            <span className="font-black uppercase tracking-widest text-xs">Admin Zone</span>
          </div>
          <h1 className="text-5xl font-display font-black uppercase text-pop-black">User Directory</h1>
          <p className="text-xl font-bold text-gray-800 mt-2">Manage user access and profiles.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 border-3 border-pop-black shadow-neo flex items-center space-x-4 transform rotate-1 hover:rotate-0 transition-transform">
            <div className="p-4 bg-pop-blue border-2 border-pop-black text-pop-black">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-gray-500 tracking-wider">Total Users</p>
              <p className="text-3xl font-black text-pop-black">{totalUsers}</p>
            </div>
          </div>
          <div className="bg-white p-6 border-3 border-pop-black shadow-neo flex items-center space-x-4 transform -rotate-1 hover:rotate-0 transition-transform">
            <div className="p-4 bg-pop-pink border-2 border-pop-black text-pop-black">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-gray-500 tracking-wider">Administrators</p>
              <p className="text-3xl font-black text-pop-black">{adminCount}</p>
            </div>
          </div>
          <div className="bg-white p-6 border-3 border-pop-black shadow-neo flex items-center space-x-4 transform rotate-1 hover:rotate-0 transition-transform">
            <div className="p-4 bg-pop-mint border-2 border-pop-black text-pop-black">
              <User className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-gray-500 tracking-wider">Regular Guests</p>
              <p className="text-3xl font-black text-pop-black">{regularUsers}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border-3 border-pop-black shadow-neo-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-3 divide-pop-black">
              <thead className="bg-pop-yellow">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-pop-black uppercase tracking-wider border-r-2 border-pop-black">User Profile</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-pop-black uppercase tracking-wider border-r-2 border-pop-black">Contact Info</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-pop-black uppercase tracking-wider border-r-2 border-pop-black">Role</th>
                  <th className="px-6 py-4 text-right text-xs font-black text-pop-black uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y-2 divide-gray-200">
                {loading && (
                  <tr><td colSpan={4} className="p-8 text-center text-xl font-black uppercase animate-pulse">Loading users...</td></tr>
                )}

                {!loading && users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap border-r-2 border-gray-200">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-pop-black text-white flex items-center justify-center font-black text-sm border-2 border-pop-black shadow-neo-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-black uppercase text-pop-black">{user.name}</div>
                          <div className="text-xs font-bold text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-r-2 border-gray-200">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{user.email}</span>
                        <span className="text-xs font-bold text-gray-500">{user.phoneNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-r-2 border-gray-200">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-black uppercase border-2 border-pop-black shadow-neo-sm ${user.role === 'ADMIN' ? 'bg-pop-pink text-pop-black' : 'bg-pop-mint text-pop-black'}`}>
                        {user.role === 'ADMIN' ? <Shield className="w-3 h-3 mr-1 self-center" /> : <User className="w-3 h-3 mr-1 self-center" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => initiateDelete(user.id)}
                        className="p-2 text-red-600 hover:bg-red-100 border-2 border-transparent hover:border-pop-black hover:shadow-neo-sm transition-all"
                        title="Delete User"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete User"
          message="Are you sure you want to delete this user? This action cannot be undone."
        />
      </div>
    </div>
  );
};

export default ManageUsers;