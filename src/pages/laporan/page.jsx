import React, { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Table from './components/tableLap';
import LaporanForm from './components/laporanForm';

export default function LaporanPage() {
    const [formVisible, setFormVisible] = useState(false);
    const [editData, setEditData] = useState(null);
    const [formMode, setFormMode] = useState('create');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleAddLaporan = () => {
        setFormMode('create');
        setEditData(null);
        setFormVisible(true);
    };

    const handleEditLaporan = (data) => {
        setFormMode('edit');
        setEditData(data);
        setFormVisible(true);
    };

    const handleFormSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
        setFormVisible(false);
        setEditData(null);
    };

    const handleFormCancel = () => {
        setFormVisible(false);
        setEditData(null);
    };

    return (
        <div className="w-full flex h-full p-4 flex-col">
            <div className="flex flex-row justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Manajemen Laporan</h1>
                <Button 
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddLaporan}
                    size="large"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 'bold'
                    }}
                >
                    Tambah Laporan
                </Button>
            </div>

            <div className="flex w-full h-full mt-4">
                <Table 
                    refreshTrigger={refreshTrigger}
                    onEdit={handleEditLaporan}
                />
            </div>

            {/* Form Modal */}
            <LaporanForm
                visible={formVisible}
                onCancel={handleFormCancel}
                onSuccess={handleFormSuccess}
                editData={editData}
                mode={formMode}
            />
        </div>
    );
}
