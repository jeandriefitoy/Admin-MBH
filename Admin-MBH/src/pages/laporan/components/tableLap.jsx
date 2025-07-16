  import React from 'react';
  import { Table, Button, Space } from 'antd';

  const UserTable = () => {
    const dummyData = [
      {
        key: '1',
        pelapor: 'johndoe',
        kategori: 'john@example.com',
        namaJenis: '081234567890',
        lokasiKejadian: 'User',
        foto: 'ktp-john.jpg',
        status: 'Proses',
        lokasiKlaim: 'Lokasi 1',
        waktu: '2023-10-01 12:00',
      },
      {
        key: '2',
        pelapor: 'janesmith',
        kategori: 'jane@example.com',
        namaJenis: '089876543210',
        lokasiKejadian: 'Admin',
        foto: 'ktp-jane.jpg',
                status: 'Proses',
        lokasiKlaim: 'Lokasi 1',
        waktu: '2023-10-01 12:00',
      },
      {
        key: '3',
        pelapor: 'bobwilson',
        kategori: 'bob@example.com',
        namaJenis: '087654321098',
        lokasiKejadian: 'User',
        foto: 'ktp-bob.jpg',
                status: 'Proses',
        lokasiKlaim: 'Lokasi 1',
        waktu: '2023-10-01 12:00',
      },
    ];

    const columns = [
      {
        title: 'Pelapor',
        dataIndex: 'pelapor',
        key: 'pelapor',
      },
      {
        title: 'kategori',
        dataIndex: 'kategori',
        key: 'kategori',
      },
      {
        title: 'Nama Jenis',
        dataIndex: 'namaJenis',
        key: 'namaJenis',
      },
      {
        title: 'Lokasi Kejadian',
        dataIndex: 'lokasiKejadian',
        key: 'lokasiKejadian',
      },
      {
        title: 'Foto',
        dataIndex: 'foto',
        key: 'foto',
      },
      {
        title: 'status',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'Lokasi Klaim',
        dataIndex: 'lokasiKlaim',
        key: 'lokasiKlaim',
      },
      {
        title: 'Waktu',
        dataIndex: 'waktu',
        key: 'waktu',
      },
      {
        title: 'Aksi',
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
            <Button type="secondary" onClick={() => handleDetail(record)}>
              Detail
            </Button>
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
