import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal } from 'antd';
import LokasiService from '../../../service/lokasiService';
import LokasiForm from './lokasiForm';

const LokasiTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch data dari API
  const fetchLokasi = async () => {
    setLoading(true);
    try {
      const response = await LokasiService.getAllLokasi();
      
      const transformedData = response.map((item) => ({
        key: item.id_lokasi_klaim,
        id_lokasi: item.id_lokasi_klaim,
        nama_lokasi: item.lokasi_klaim,
        tanggal_dibuat: new Date(item.created_at).toLocaleDateString('id-ID'),
        ...item
      }));

      setData(transformedData);
    } catch (error) {
      message.error('Gagal memuat data lokasi');
      console.error('Error fetching lokasi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLokasi();
  }, []);

  const columns = [
    {
      title: 'ID Lokasi',
      dataIndex: 'id_lokasi',
      key: 'id_lokasi',
      width: '30%',
      align: 'start',
    },
    {
      title: 'Nama Lokasi',
      dataIndex: 'nama_lokasi',
      key: 'nama_lokasi',
      width: '40%',
      align: 'start',
    },
    {
      title: 'Tanggal Dibuat',
      dataIndex: 'tanggal_dibuat',
      key: 'tanggal_dibuat',
      width: '20%',
      align: 'start',
    },
    {
      title: 'Aksi',
      key: 'action',
      width: '10%',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button 
            type="primary" 
            danger 
            size="small"
            onClick={() => handleDelete(record)}
          >
            Hapus
          </Button>
        </Space>
      ),
    },
  ];

  const handleDetail = (record) => {
    Modal.info({
      title: 'Detail Lokasi',
      content: (
        <div>
          <p><strong>ID Lokasi:</strong> {record.id_lokasi_klaim}</p>
          <p><strong>Nama Lokasi:</strong> {record.lokasi_klaim}</p>
          <p><strong>Dibuat pada:</strong> {new Date(record.created_at).toLocaleString('id-ID')}</p>
        </div>
      ),
      width: 500,
    });
  };

  const handleEdit = (record) => {
    setEditData(record);
    setFormVisible(true);
  };

  const handleDelete = (record) => {
    setSelectedRecord(record);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedRecord) return;
    
    setDeleteLoading(true);
    
    try {
      const response = await LokasiService.deleteLokasi(selectedRecord.id_lokasi_klaim);
      
      if (response && response.message) {
        message.success(response.message);
      } else {
        message.success('Lokasi berhasil dihapus');
      }
      
      setDeleteModalVisible(false);
      setSelectedRecord(null);
      await fetchLokasi();
      
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Gagal menghapus lokasi: ' + (error.message || 'Terjadi kesalahan'));
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setSelectedRecord(null);
  };

  const handleAdd = () => {
    setEditData(null);
    setFormVisible(true);
  };

  const handleFormCancel = () => {
    setFormVisible(false);
    setEditData(null);
  };

  const handleFormSuccess = () => {
    fetchLokasi();
  };

  return (
    <div>
      {/* Header dengan tombol tambah */}
      <div style={{ 
        marginBottom: 16, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h3 style={{ margin: 0 }}>Daftar Lokasi Klaim</h3>
        <Button 
          type="primary" 
          onClick={handleAdd}
          size="large"
        >
          Tambah Lokasi
        </Button>
      </div>

      {/* Tabel */}
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} lokasi`
        }}
        style={{ 
          width: '100%', 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
          borderRadius: '8px',
          backgroundColor: 'white'
        }}
        scroll={{ x: 800 }}
      />

      {/* Form Modal untuk Create/Edit */}
      <LokasiForm
        visible={formVisible}
        onCancel={handleFormCancel}
        onSuccess={handleFormSuccess}
        editData={editData}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title="Konfirmasi Hapus Lokasi"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Ya, Hapus"
        cancelText="Batal"
        okType="danger"
        confirmLoading={deleteLoading}
        width={500}
        centered
        destroyOnClose
      >
        <div>
          <p>Apakah Anda yakin ingin menghapus lokasi berikut?</p>
          {selectedRecord && (
            <div style={{ 
              background: '#f5f5f5', 
              padding: 16, 
              borderRadius: 8, 
              margin: '16px 0',
              border: '1px solid #d9d9d9'
            }}>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>ID:</strong> {selectedRecord.id_lokasi_klaim}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Nama:</strong> {selectedRecord.lokasi_klaim}
              </p>
            </div>
          )}
          <p style={{ color: '#ff4d4f', marginBottom: 0, fontSize: '14px' }}>
            <strong>⚠️ Peringatan:</strong> Tindakan ini tidak dapat dibatalkan!
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default LokasiTable;
