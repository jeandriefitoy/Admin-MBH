import React from 'react';
import { Card, Typography } from 'antd';
import LokasiTable from './components/tableLok';

const { Title } = Typography;

const LokasiPage = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2} style={{ marginBottom: '24px' }}>
          Manajemen Lokasi Klaim
        </Title>
        <LokasiTable />
      </Card>
    </div>
  );
};

export default LokasiPage;
