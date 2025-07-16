  import React from 'react';
  import { Table, Button, Space } from 'antd';
import { AlignCenter } from 'lucide-react';

  const LokasiTable = () => {
    const dummyData = [
      {
        key: '1',
        pelapor: 'johndoe',
        kategori: 'john@example.com',
        namaJenis: '081234567890',
      },
      {
        key: '2',
        pelapor: 'janesmith',
        kategori: 'jane@example.com',
        namaJenis: '089876543210',
      },
      {
        key: '3',
        pelapor: 'bobwilson',
        kategori: 'bob@example.com',
        namaJenis: '087654321098',
      },
    ];

    const columns = [
      {
        title: 'Pelapor',
        dataIndex: 'pelapor',
        key: 'pelapor',
        width: '30%',
        align: 'start',
        justify: 'start',
      },
      {
        title: 'kategori',
        dataIndex: 'kategori',
        key: 'kategori',
        width: '40%',
        align: 'start',
        justify: 'start',
      },
      {
        title: 'Aksi',
        key: 'action',
        width: '30%',
        align: 'start',
        justify: 'start',
        render: (_, record) => (
          <Space size="middle">
            <Button type="primary" onClick={() => handleDetail(record)}>
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

  export default LokasiTable;
