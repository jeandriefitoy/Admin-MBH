  import React from 'react';
  import { Table, Button, Space } from 'antd';

  const UserTable = () => {
    const dummyData = [
      {
        key: '1',
        username: 'johndoe',
        email: 'john@example.com',
        phone: '081234567890',
        role: 'User',
        identityPhoto: 'ktp-john.jpg',
      },
      {
        key: '2',
        username: 'janesmith',
        email: 'jane@example.com',
        phone: '089876543210',
        role: 'Admin',
        identityPhoto: 'ktp-jane.jpg',
      },
      {
        key: '3',
        username: 'bobwilson',
        email: 'bob@example.com',
        phone: '087654321098',
        role: 'User',
        identityPhoto: 'ktp-bob.jpg',
      },
    ];

    const columns = [
      {
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
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
      },
      {
        title: 'Foto Identitas',
        dataIndex: 'identityPhoto',
        key: 'identityPhoto',
      },
      {
        title: 'Aksi',
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
            <Button type="primary" onClick={() => handleEdit(record)}>
              Edit
            </Button>
            <Button type="primary" danger onClick={() => handleDelete(record)}>
              Hapus
            </Button>
          </Space>
        ),
      },
    ];

    const handleEdit = (record) => {
      console.log('Edit clicked for:', record);
    };

    const handleDelete = (record) => {
      console.log('Delete clicked for:', record);
    };

    return (
      <Table
        columns={columns}
        dataSource={dummyData}
        pagination={{ pageSize: 10 }}
        style={{ width: '100%', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}
      />
    );
  };

  export default UserTable;
