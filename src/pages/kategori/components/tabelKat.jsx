import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal } from 'antd';
import KategoriService from '../../../service/kategoriService';
import KategoriForm from './kategoriForm';

const KategoriTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchKategori = async () => {
    setLoading(true);
    try {
      const response = await KategoriService.getAllKategori();
      
      const transformedData = response.map((item) => ({
        key: item.id_kategori,
        id_kategori: item.id_kategori,
        nama_kategori: item.nama_kategori,
        tanggal_dibuat: new Date(item.created_at).toLocaleDateString('id-ID'),
        ...item
      }));

      setData(transformedData);
    } catch (error) {
      message.error('Gagal memuat data kategori');
      console.error('Error fetching kategori:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  const columns = [
    {
      title: 'ID Kategori',
      dataIndex: 'id_kategori',
      key: 'id_kategori',
      width: '30%',
      align: 'start',
    },
    {
      title: 'Nama Kategori',
      dataIndex: 'nama_kategori',
      key: 'nama_kategori',
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
      title: 'Detail Kategori',
      content: (
        <div>
          <p><strong>ID Kategori:</strong> {record.id_kategori}</p>
          <p><strong>Nama Kategori:</strong> {record.nama_kategori}</p>
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
      const response = await KategoriService.deleteKategori(selectedRecord.id_kategori);
      
      if (response && response.message) {
        message.success(response.message);
      } else {
        message.success('Kategori berhasil dihapus');
      }
      
      setDeleteModalVisible(false);
      setSelectedRecord(null);
      await fetchKategori();
      
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Gagal menghapus kategori: ' + (error.message || 'Terjadi kesalahan'));
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
    fetchKategori();
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
        <h3 style={{ margin: 0 }}>Daftar Kategori Barang</h3>
        <Button 
          type="primary" 
          onClick={handleAdd}
          size="large"
        >
          Tambah Kategori
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
          showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} kategori`
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
      <KategoriForm
        visible={formVisible}
        onCancel={handleFormCancel}
        onSuccess={handleFormSuccess}
        editData={editData}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title="Konfirmasi Hapus Kategori"
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
          <p>Apakah Anda yakin ingin menghapus kategori berikut?</p>
          {selectedRecord && (
            <div style={{ 
              background: '#f5f5f5', 
              padding: 16, 
              borderRadius: 8, 
              margin: '16px 0',
              border: '1px solid #d9d9d9'
            }}>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>ID:</strong> {selectedRecord.id_kategori}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Nama:</strong> {selectedRecord.nama_kategori}
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

export default KategoriTable;
