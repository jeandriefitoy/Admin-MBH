import React from 'react';
import { Card, Typography, Alert } from 'antd';
import TableSpm from './components/tableSpm';

const { Title } = Typography;

const KlaimSatpamPage = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2} style={{ marginBottom: '16px' }}>
          Manajemen Klaim
        </Title>
        
        <TableSpm />
      </Card>
    </div>
  );
};

export default KlaimSatpamPage;