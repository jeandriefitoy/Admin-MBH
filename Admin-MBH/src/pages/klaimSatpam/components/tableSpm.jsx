  import React, { useState } from 'react';
  import { Table, Button, Tag } from 'antd';
  import { DeleteOutlined } from '@ant-design/icons';

  const TableSpm = () => {
    const columns = [
      {
        title: 'Id Klaim',
        dataIndex: 'idKlaim',
        key: 'idKlaim',
      },
      {
        title: 'Id Laporan Cocok',
        dataIndex: 'idLaporanCocok',
        key: 'idLaporanCocok',
      },
      {
        title: 'Nama Satpam',
        dataIndex: 'namaSatpam',
        key: 'namaSatpam',
      },
      {
        title: 'Nama Penerima',
        dataIndex: 'namaPenerima',
        key: 'namaPenerima',
      },
      {
        title: 'No HP Penerima',
        dataIndex: 'noHpPenerima',
        key: 'noHpPenerima',
      },
      {
        title: 'Foto Klaim',
        dataIndex: 'fotoKlaim',
        key: 'fotoKlaim',
        render: (text) => <img src={text} alt="Foto Klaim" style={{ width: 50, height: 50 }} />,
      },
      {
        title: 'Waktu Terima',
        dataIndex: 'waktuTerima',
        key: 'waktuTerima',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
          let color = 'default';
          if (status === 'selesai') color = 'green';
          if (status === 'cocok') color = 'blue';
          if (status === 'proses') color = 'orange';
          return <Tag color={color}>{status.toUpperCase()}</Tag>;
        },
      },
      {
        title: 'Aksi',
        key: 'aksi',
        render: (_, record) => (
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.idKlaim)}
          >
            Hapus
          </Button>
        ),
      },
    ];

    const dummyData = [
      {
        idKlaim: 'KLM001',
        idLaporanCocok: 'LPC001',
        namaSatpam: 'John Doe',
        namaPenerima: 'Jane Smith',
        noHpPenerima: '081234567890',
        fotoKlaim: 'https://example.com/dummy-image-1.jpg',
        waktuTerima: '2024-01-15 10:30:00',
        status: 'selesai'
      },
      {
        idKlaim: 'KLM002',
        idLaporanCocok: 'LPC002',
        namaSatpam: 'Bob Wilson',
        namaPenerima: 'Alice Brown',
        noHpPenerima: '081234567891',
        fotoKlaim: 'https://example.com/dummy-image-2.jpg',
        waktuTerima: '2024-01-15 11:45:00',
        status: 'proses'
      },
      {
        idKlaim: 'KLM002',
        idLaporanCocok: 'LPC002',
        namaSatpam: 'Bob Wilson',
        namaPenerima: 'Alice Brown',
        noHpPenerima: '081234567891',
        fotoKlaim: 'https://example.com/dummy-image-2.jpg',
        waktuTerima: '2024-01-15 11:45:00',
        status: 'proses'
      },
      {
        idKlaim: 'KLM003',
        idLaporanCocok: 'LPC003',
        namaSatpam: 'Mike Johnson',
        namaPenerima: 'Sarah Davis',
        noHpPenerima: '081234567892',
        fotoKlaim: 'https://example.com/dummy-image-3.jpg',
        waktuTerima: '2024-01-15 13:15:00',
        status: 'cocok'
      }
    ];

    const handleDelete = (id) => {
      console.log('Delete item with id:', id);
    };

    return (
      <div style={{ width: '100%' }}>
        <Table
          columns={columns}
          dataSource={dummyData} 
          rowKey="idKlaim"
          pagination={{ pageSize: 10 }}
          style={{ width: '100%', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}
        />
      </div>
    );
  };

  export default TableSpm;
