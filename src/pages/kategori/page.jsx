import React from 'react';
import { Card, Typography } from 'antd';
import KategoriTable from './components/tabelKat';

const { Title } = Typography;

const KategoriPage = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2} style={{ marginBottom: '24px' }}>
          Manajemen Kategori Barang
        </Title>
        <KategoriTable />
      </Card>
    </div>
  );
};

export default KategoriPage;
