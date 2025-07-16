import React from 'react';
import { Card, Typography, Alert } from 'antd';
import PencocokanTable from './components/tablePen';

const { Title } = Typography;

const PencocokanPage = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2} style={{ marginBottom: '16px' }}>
          Manajemen Pencocokan Laporan
        </Title>
        
        <PencocokanTable />
      </Card>
    </div>
  );
};

export default PencocokanPage;
