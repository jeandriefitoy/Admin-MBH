import { useState, useEffect } from 'react';
import { message } from 'antd';
import authService from '../../../service/authService';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.getUsers();
      const mappedUsers = response.map(user => ({
        key: user.id,
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.no_hp,
        role: user.role,
        identityPhoto: user.url_foto_identitas,
        createdAt: user.created_at,
        createdBy: user.created_by
      }));
      setUsers(mappedUsers);
      message.success('Data pengguna berhasil dimuat');
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
      message.error('Gagal memuat data pengguna');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    try {
      await authService.createUser(userData);
      message.success('Pengguna berhasil ditambahkan');
      await fetchUsers();
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      message.error('Gagal menambahkan pengguna');
      return false;
    }
  };

  const deleteUser = async (userId) => {    
    if (!userId) {
      message.error('ID user tidak valid');
      return false;
    }

    try {
      const response = await authService.deleteUser(userId);
      setUsers(prevUsers => {
        const newUsers = prevUsers.filter(user => user.id !== userId);
        return newUsers;
      });
      
      message.success('Pengguna berhasil dihapus');
      return true;
    } catch (error) {      
      if (error.response?.data?.error) {
        message.error(error.response.data.error);
      } else if (error.message) {
        message.error(`Gagal menghapus pengguna: ${error.message}`);
      } else {
        message.error('Gagal menghapus pengguna');
      }
      
      return false;
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      console.log('Updating user with ID:', userId);
      console.log('Update data:', userData);
      
      if (userData instanceof FormData) {
        console.log('FormData contents:');
        for (let [key, value] of userData.entries()) {
          console.log(key, value);
        }
      }

      const response = await authService.updateUser(userId, userData);
      console.log('Update response:', response);
      
      message.success('Pengguna berhasil diupdate');
      await fetchUsers();
      
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  console.log('useUsers hook returning:', { users, loading, error, deleteUser }); // Debug log

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    deleteUser, // Pastikan ini di-return
    updateUser,
    refetch: fetchUsers
  };
};
