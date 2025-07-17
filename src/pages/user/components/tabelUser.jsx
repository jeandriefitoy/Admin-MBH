import React, { useState, useMemo } from 'react';
import { Table, Button, Space, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useUsers } from '../hooks/useUser';
import EditUser from './edit';

const UserTable = ({ searchText = '', roleFilter = 'all' }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const { users, loading, deleteUser, updateUser, refetch } = useUsers();

  const showModal = (record) => {
    setSelectedUser(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const handleSuccess = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const showDeleteModal = (record) => {
    console.log('showDeleteModal called with:', record);
    setUserToDelete(record);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setUserToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    console.log('Delete confirmed for user:', userToDelete);
    
    try {
      const success = await deleteUser(userToDelete.id);
      if (success) {
        setIsDeleteModalVisible(false);
        setUserToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Terjadi kesalahan saat menghapus user');
    }
  };

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = [...users];
    if (searchText && searchText.trim() !== '') {
      const searchLower = searchText.toLowerCase().trim();
      filtered = filtered.filter(user => 
        user.username?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.phone?.toLowerCase().includes(searchLower) ||
        user.role?.toLowerCase().includes(searchLower)
      );
    }
    if (roleFilter && roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    const roleOrder = { 'admin': 1, 'satpam': 2, 'tamu': 3 };
    
    filtered.sort((a, b) => {
      const roleComparison = (roleOrder[a.role] || 999) - (roleOrder[b.role] || 999);
      if (roleComparison !== 0) {
        return roleComparison;
      }
      return a.username.localeCompare(b.username);
    });

    return filtered;
  }, [users, searchText, roleFilter]);

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => (
        <div>
          <div style={{ 
            fontWeight: record.role === 'admin' ? 'bold' : 'normal',
            color: record.role === 'admin' ? '#1890ff' : 'inherit'
          }}>
            {text}
          </div>
          {record.role === 'admin' && (
            <div style={{ fontSize: '10px', color: '#1890ff' }}>★ ADMIN</div>
          )}
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'No Hp',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        let color = '#52c41a';
        let bgColor = '#f6ffed';
        
        if (role === 'admin') {
          color = '#1890ff';
          bgColor = '#e6f7ff';
        } else if (role === 'satpam') {
          color = '#faad14';
          bgColor = '#fffbe6';
        }
        
        return (
          <span style={{
            textTransform: 'capitalize',
            color: color,
            fontWeight: 'bold',
            backgroundColor: bgColor,
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            border: `1px solid ${color}20`
          }}>
            {role}
          </span>
        );
      },
    },
    {
      title: 'Foto Identitas',
      dataIndex: 'identityPhoto',
      key: 'identityPhoto',
      render: (url) => url ? (
        <img 
          src={url} 
          alt="Identity" 
          style={{ 
            width: 50, 
            height: 50,
            objectFit: 'cover',
            borderRadius: '4px',
            border: '1px solid #d9d9d9'
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
          }}
        />
      ) : (
        <span style={{ color: '#999', fontSize: '12px' }}>Tidak ada foto</span>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            size="small"
            onClick={() => showModal(record)}
          >
            Edit
          </Button>
          <Button 
            type="primary" 
            danger 
            size="small"
            onClick={() => showDeleteModal(record)}
          >
            Hapus
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* Info hasil pencarian */}
      {(searchText || roleFilter !== 'all') && (
        <div style={{ 
          marginBottom: 16, 
          padding: '8px 12px',
          backgroundColor: '#f0f2f5',
          borderRadius: '4px',
          fontSize: '14px',
          color: '#666'
        }}>
          Menampilkan {filteredAndSortedUsers.length} dari {users.length} users
          {searchText && ` untuk pencarian "${searchText}"`}
          {roleFilter !== 'all' && ` dengan role "${roleFilter}"`}
        </div>
      )}

      <Table
        columns={columns}
        dataSource={filteredAndSortedUsers}
        loading={loading}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} users`,
          pageSizeOptions: ['5', '10', '20', '50']
        }}
        style={{ 
          width: '100%', 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
          borderRadius: '8px',
          backgroundColor: 'white'
        }}
        scroll={{ x: 800 }}
        rowClassName={(record) => record.role === 'admin' ? 'admin-row' : ''}
      />
      
      {/* Edit Modal */}
      <Modal
        title="Edit User"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        destroyOnClose
      >
        {selectedUser && (
          <EditUser
            initialData={selectedUser}
            userId={selectedUser?.id}
            updateUser={updateUser}
            onCancel={handleCancel}
            onSuccess={handleSuccess}
          />
        )}
      </Modal>

      <Modal
        title="Konfirmasi Hapus User"
        open={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Ya, Hapus"
        cancelText="Batal"
        okType="danger"
        width={500}
      >
        {userToDelete && (
          <div>
            <p>Apakah Anda yakin ingin menghapus user berikut?</p>
            <div style={{ marginTop: 10, padding: 10, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
              <p><strong>Username:</strong> {userToDelete.username}</p>
              <p><strong>Email:</strong> {userToDelete.email}</p>
              <p><strong>Role:</strong> {userToDelete.role}</p>
            </div>
            <p style={{ color: '#ff4d4f', marginTop: 10 }}>
              <strong>Peringatan:</strong> Tindakan ini tidak dapat dibatalkan!
            </p>
          </div>
        )}
      </Modal>

      <style jsx>{`
        :global(.admin-row) {
          background-color: #e6f7ff !important;
        }
        :global(.admin-row:hover) {
          background-color: #bae7ff !important;
        }
      `}</style>
    </div>
  );
};

export default UserTable;
