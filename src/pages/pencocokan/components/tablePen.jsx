import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal, Tag, Spin } from 'antd';
import { EyeOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import PencocokanService from '../../../service/pencocokanService';
import api from '../../../service/authService';

const PencocokanTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [userCache, setUserCache] = useState({});
  const formatDateTime = (dateTime) => {
    if (!dateTime) return { tanggal: 'Tidak diketahui', waktu: 'Tidak diketahui' };

    try {
      let date;
      if (dateTime && typeof dateTime === 'object' && dateTime._seconds) {
        date = new Date(dateTime._seconds * 1000 + (dateTime._nanoseconds || 0) / 1000000);
      } else if (dateTime && typeof dateTime === 'object' && dateTime.seconds) {
        date = new Date(dateTime.seconds * 1000 + (dateTime.nanoseconds || 0) / 1000000);
      } else {
        date = new Date(dateTime);
      }

      if (isNaN(date.getTime())) {
        return { tanggal: String(dateTime), waktu: String(dateTime) };
      }

      const tanggal = date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      const waktu = date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      return { tanggal, waktu };
    } catch (error) {
      console.error('Error formatting date:', error, dateTime);
      return { tanggal: String(dateTime), waktu: String(dateTime) };
    }
  };

  const formatFullDateTime = (dateTime) => {
    if (!dateTime) return 'Tidak diketahui';

    try {
      let date;
      if (dateTime && typeof dateTime === 'object' && dateTime._seconds) {
        date = new Date(dateTime._seconds * 1000 + (dateTime._nanoseconds || 0) / 1000000);
      } else if (dateTime && typeof dateTime === 'object' && dateTime.seconds) {
        date = new Date(dateTime.seconds * 1000 + (dateTime.nanoseconds || 0) / 1000000);
      } else {
        date = new Date(dateTime);
      }

      if (isNaN(date.getTime())) {
        return String(dateTime);
      }

      return date.toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error, dateTime);
      return String(dateTime);
    }
  };


  const getUserData = async (userId) => {
    if (userCache[userId]) {
      return userCache[userId];
    }

    try {
      const userData = await api.getUserById(userId);
      const userInfo = {
        name: userData.username || userData.nama || 'Unknown User',
        role: userData.role || 'user',
        email: userData.email || ''
      };

      setUserCache(prev => ({
        ...prev,
        [userId]: userInfo
      }));

      return userInfo;
    } catch (error) {
      console.error('Error fetching user data:', error);
      const fallbackInfo = {
        name: userId,
        role: 'unknown',
        email: ''
      };

      setUserCache(prev => ({
        ...prev,
        [userId]: fallbackInfo
      }));

      return fallbackInfo;
    }
  };

  const fetchPencocokan = async () => {
    setLoading(true);
    try {
      const response = await PencocokanService.getAllCocok();
      const transformedData = await Promise.all(
        response.map(async (item, index) => {
          const userData = await getUserData(item.created_by);

          const dateTimeFormatted = formatDateTime(item.created_at);

          return {
            key: item.id_laporan_cocok,
            no: index + 1,
            id_laporan_cocok: item.id_laporan_cocok,
            laporan_hilang: item.id_laporan_hilang,
            laporan_temuan: item.id_laporan_temuan,
            skor_cocok: item.skor_cocok,
            tanggal: dateTimeFormatted.tanggal,
            waktu: dateTimeFormatted.waktu,
            dibuat_oleh: item.created_by,
            dibuat_oleh_nama: userData.name,
            dibuat_oleh_role: userData.role,
            dibuat_oleh_email: userData.email,
            ...item
          };
        })
      );

      setData(transformedData);
    } catch (error) {
      message.error('Gagal memuat data pencocokan');
      console.error('Error fetching pencocokan:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPencocokan();
  }, []);

  const getSkorColor = (skor) => {
    if (skor >= 90) return 'green';
    if (skor >= 70) return 'orange';
    if (skor >= 50) return 'yellow';
    return 'red';
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'red';
      case 'satpam': return 'blue';
      case 'user': return 'green';
      default: return 'default';
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return '👑';
      case 'satpam': return '🛡️';
      case 'user': return '👤';
      default: return '❓';
    }
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: '2%',
      align: 'center',
    },
    {
      title: 'Laporan Hilang',
      dataIndex: 'laporan_hilang',
      key: 'laporan_hilang',
      width: '15%',
      align: 'start',
      render: (text) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Laporan Temuan',
      dataIndex: 'laporan_temuan',
      key: 'laporan_temuan',
      width: '15%',
      align: 'start',
      render: (text) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Skor Cocok',
      dataIndex: 'skor_cocok',
      key: 'skor_cocok',
      width: '10%',
      align: 'center',
      render: (skor) => (
        <Tag color={getSkorColor(skor)} style={{ fontWeight: 'bold' }}>
          {skor}%
        </Tag>
      ),
      sorter: (a, b) => a.skor_cocok - b.skor_cocok,
    },
    {
      title: 'Tanggal',
      dataIndex: 'tanggal',
      key: 'tanggal',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Waktu',
      dataIndex: 'waktu',
      key: 'waktu',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Dibuat Oleh',
      key: 'dibuat_oleh_info',
      width: '15%',
      align: 'start',
      render: (_, record) => (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 4
          }}>
            <span style={{ marginRight: 4 }}>
              {getRoleIcon(record.dibuat_oleh_role)}
            </span>
            <span style={{ fontWeight: 'bold', fontSize: '13px' }}>
              {record.dibuat_oleh_nama}
            </span>
          </div>
          <Tag
            color={getRoleColor(record.dibuat_oleh_role)}
            size="small"
            style={{ fontSize: '11px' }}
          >
            {record.dibuat_oleh_role?.toUpperCase() || 'UNKNOWN'}
          </Tag>
        </div>
      ),
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Satpam', value: 'satpam' },
        { text: 'User', value: 'user' },
      ],
      onFilter: (value, record) => record.dibuat_oleh_role?.toLowerCase() === value,
    },
    {
      title: 'Aksi',
      key: 'action',
      width: '15%',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
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
      title: 'Detail Pencocokan Laporan',
      content: (
        <div style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <strong>ID Pencocokan:</strong>
            <div style={{
              fontFamily: 'monospace',
              background: '#f5f5f5',
              padding: '4px 8px',
              borderRadius: 4,
              marginTop: 4
            }}>
              {record.id_laporan_cocok}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <strong>Laporan Hilang:</strong>
            <div style={{
              fontFamily: 'monospace',
              background: '#f5f5f5',
              padding: '4px 8px',
              borderRadius: 4,
              marginTop: 4
            }}>
              {record.laporan_hilang}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <strong>Laporan Temuan:</strong>
            <div style={{
              fontFamily: 'monospace',
              background: '#f5f5f5',
              padding: '4px 8px',
              borderRadius: 4,
              marginTop: 4
            }}>
              {record.laporan_temuan}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <strong>Skor Kecocokan:</strong>
            <div style={{ marginTop: 4 }}>
              <Tag color={getSkorColor(record.skor_cocok)} style={{ fontWeight: 'bold', fontSize: '14px' }}>
                {record.skor_cocok}%
              </Tag>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <strong>Dibuat pada:</strong>
            <div style={{ marginTop: 4 }}>
              {formatFullDateTime(record.created_at)}
            </div>
          </div>

          <div style={{ marginBottom: 0 }}>
            <strong>Dibuat oleh:</strong>
            <div style={{
              background: '#f5f5f5',
              padding: '8px 12px',
              borderRadius: 4,
              marginTop: 4
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 4
              }}>
                <span style={{ marginRight: 8, fontSize: '16px' }}>
                  {getRoleIcon(record.dibuat_oleh_role)}
                </span>
                <span style={{ fontWeight: 'bold' }}>
                  {record.dibuat_oleh_nama}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: 4 }}>
                {record.dibuat_oleh_email}
              </div>
              <div>
                <Tag color={getRoleColor(record.dibuat_oleh_role)} size="small">
                  {record.dibuat_oleh_role?.toUpperCase() || 'UNKNOWN'}
                </Tag>
              </div>
              <div style={{
                fontSize: '11px',
                color: '#999',
                fontFamily: 'monospace',
                marginTop: 4
              }}>
                ID: {record.dibuat_oleh}
              </div>
            </div>
          </div>
        </div>
      ),
      width: 600,
    });
  };


  const handleDelete = (record) => {
    setSelectedRecord(record);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedRecord) return;

    setDeleteLoading(true);

    try {
      const response = await PencocokanService.deleteCocok(selectedRecord.id_laporan_cocok);

      if (response && response.message) {
        message.success(response.message);
      } else {
        message.success('Data pencocokan berhasil dihapus');
      }

      setDeleteModalVisible(false);
      setSelectedRecord(null);
      await fetchPencocokan();

    } catch (error) {
      console.error('Delete error:', error);
      message.error('Gagal menghapus data pencocokan: ' + (error.message || 'Terjadi kesalahan'));
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setSelectedRecord(null);
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        marginBottom: 16,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0 }}>Daftar Pencocokan Laporan</h3>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Total: {data.length} pencocokan
        </div>
      </div>

      {/* Info Card */}
      <div style={{
        marginBottom: 16,
        padding: 12,
        background: '#f0f8ff',
        border: '1px solid #d6f7ff',
        borderRadius: 8
      }}>
        <div style={{ fontSize: '14px', color: '#1890ff', marginBottom: 8 }}>
          <strong>Keterangan Skor:</strong>
          <Space style={{ marginLeft: 16 }}>
            <Tag color="green">≥90% Sangat Cocok</Tag>
            <Tag color="orange">70-89% Cocok</Tag>
            <Tag color="yellow">50-69% Kurang Cocok</Tag>
            <Tag color="red">&lt;50% Tidak Cocok</Tag>
          </Space>
        </div>
        <div style={{ fontSize: '14px', color: '#1890ff' }}>
          <strong>Role:</strong>
          <Space style={{ marginLeft: 16 }}>
            <span>👑 <Tag color="red" size="small">ADMIN</Tag></span>
            <span>🛡️ <Tag color="blue" size="small">SATPAM</Tag></span>
            <span>👤 <Tag color="green" size="small">USER</Tag></span>
          </Space>
        </div>
      </div>

      {/* Tabel */}
      {/* Tabel */}
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} pencocokan`
        }}
        style={{
          width: '100%',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          backgroundColor: 'white'
        }}
        scroll={{ x: 1200 }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title="Konfirmasi Hapus Pencocokan"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Ya, Hapus"
        cancelText="Batal"
        okType="danger"
        confirmLoading={deleteLoading}
        width={600}
        centered
        destroyOnClose
      >
        <div>
          <p>Apakah Anda yakin ingin menghapus data pencocokan berikut?</p>
          {selectedRecord && (
            <div style={{
              background: '#f5f5f5',
              padding: 16,
              borderRadius: 8,
              margin: '16px 0',
              border: '1px solid #d9d9d9'
            }}>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>ID Pencocokan:</strong> {selectedRecord.id_laporan_cocok}
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Laporan Hilang:</strong> {selectedRecord.laporan_hilang}
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Laporan Temuan:</strong> {selectedRecord.laporan_temuan}
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Skor Cocok:</strong>
                <Tag color={getSkorColor(selectedRecord.skor_cocok)} style={{ marginLeft: 8 }}>
                  {selectedRecord.skor_cocok}%
                </Tag>
              </p>
              <p style={{ margin: 0 }}>
                <strong>Dibuat oleh:</strong>
                <span style={{ marginLeft: 8 }}>
                  {getRoleIcon(selectedRecord.dibuat_oleh_role)} {selectedRecord.dibuat_oleh_nama}
                </span>
                <Tag
                  color={getRoleColor(selectedRecord.dibuat_oleh_role)}
                  size="small"
                  style={{ marginLeft: 8 }}
                >
                  {selectedRecord.dibuat_oleh_role?.toUpperCase() || 'UNKNOWN'}
                </Tag>
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

export default PencocokanTable;

