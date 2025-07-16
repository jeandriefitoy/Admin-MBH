  import React from 'react';
  import { Table, Button, Space } from 'antd';

  const UserTable = () => {
    const dummyData = [
      {
        key: '1',
        no: 'johndoe',
        laporanTemuan: 'john@example.com',
        skorCocok: '081234567890',
        tanggal: 'User',
        dibuatOleh: 'ktp-john.jpg',
        status: 'Proses',
        laporanHilang: 'Lokasi 1',
        waktu: '2023-10-01 12:00',
      },
      {
        key: '2',
        no: 'janesmith',
        laporanTemuan: 'jane@example.com',
        skorCocok: '089876543210',
        tanggal: 'Admin',
        dibuatOleh: 'ktp-jane.jpg',
                status: 'Proses',
        laporanHilang: 'Lokasi 1',
        waktu: '2023-10-01 12:00',
      },
      {
        key: '3',
        no: 'bobwilson',
        laporanTemuan: 'bob@example.com',
        skorCocok: '087654321098',
        tanggal: 'User',
        dibuatOleh: 'ktp-bob.jpg',
                status: 'Proses',
        laporanHilang: 'Lokasi 1',
        waktu: '2023-10-01 12:00',
      },
    ];

    const columns = [
      {
        title: 'No',
        dataIndex: 'no',
        key: 'no',
      },
      {
        title: 'Laporan Hilang',
        dataIndex: 'laporanHilang',
        key: 'laporanHilang',
      },
      {
        title: 'Laporan Temuan',
        dataIndex: 'laporanTemuan',
        key: 'laporanTemuan',
      },
      {
        title: 'Skor Cocok',
        dataIndex: 'skorCocok',
        key: 'skorCocok',
      },
      {
        title: 'Tanggal',
        dataIndex: 'tanggal',
        key: 'tanggal',
      },
      {
        title: 'Dibuat Oleh Satpam',
        dataIndex: 'dibuatOleh',
        key: 'dibuatOleh',
      },
      {
        title: 'Aksi',
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
            <Button type="primary" danger onClick={() => handleDelete(record)}>
              Hapus
            </Button>
          </Space>
        ),
      },
    ];

    const handleDetail = (record) => {
      console.log('Detail clicked for:', record);
    }

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
