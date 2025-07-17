import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, message, Modal, Image, Space, Spin, Alert } from 'antd';
import { DeleteOutlined, EyeOutlined, UserOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import KlaimService from '../../../service/klaimService';
import api from '../../../service/authService';

const TableSpm = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [userCache, setUserCache] = useState({});

  const parseFirebaseTimestamp = (timestamp) => {
    if (!timestamp) return 'Tidak diketahui';

    try {
      if (typeof timestamp === 'string') {
        return new Date(timestamp).toLocaleString('id-ID');
      }

      if (timestamp && typeof timestamp === 'object' && timestamp._seconds) {
        const date = new Date(timestamp._seconds * 1000);
        return date.toLocaleString('id-ID');
      }

      if (timestamp instanceof Date) {
        return timestamp.toLocaleString('id-ID');
      }

      return String(timestamp);
    } catch (error) {
      console.error('Error parsing timestamp:', error, timestamp);
      return 'Format tanggal tidak valid';
    }
  };

  const getUserData = async (userId) => {
    if (!userId) {
      return {
        name: 'Unknown User',
        role: 'unknown',
        email: '',
        phone: ''
      };
    }

    if (userCache[userId]) {
      return userCache[userId];
    }

    try {
      const userData = await api.getUserById(userId);
      const userInfo = {
        name: userData.username || userData.nama || userData.name || 'Unknown User',
        role: userData.role || 'unknown',
        email: userData.email || '',
        phone: userData.no_hp || userData.phone || userData.no_telp || ''
      };

      setUserCache(prev => ({
        ...prev,
        [userId]: userInfo
      }));

      return userInfo;
    } catch (error) {
      console.error('Error fetching user data for ID:', userId, error);
      const fallbackInfo = {
        name: `User ${String(userId).substring(0, 8)}...`,
        role: 'unknown',
        email: '',
        phone: ''
      };

      setUserCache(prev => ({
        ...prev,
        [userId]: fallbackInfo
      }));

      return fallbackInfo;
    }
  };

  const fetchKlaim = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await KlaimService.getAllKlaim();
      if (!Array.isArray(response)) {
        throw new Error('Response bukan array');
      }

      if (response.length === 0) {
        setData([]);
        return;
      }

      const transformedData = await Promise.all(
        response.map(async (item, index) => {
          try {
            const satpamData = await getUserData(item.id_satpam);
            const penerimaData = await getUserData(item.id_penerima);
            const waktuTerima = parseFirebaseTimestamp(item.waktu_terima);

            return {
              key: item.id_klaim || `klaim-${index}`,
              id_klaim: String(item.id_klaim || `klaim-${index}`),
              id_laporan_cocok: String(item.id_laporan_cocok || 'Tidak ada'),
              nama_satpam: String(satpamData.name),
              satpam_role: String(satpamData.role),
              satpam_email: String(satpamData.email),
              nama_penerima: String(penerimaData.name),
              penerima_role: String(penerimaData.role),
              penerima_email: String(penerimaData.email),
              no_hp_penerima: String(penerimaData.phone || 'Tidak ada'),
              foto_klaim: item.url_foto_klaim || null,
              waktu_terima: String(waktuTerima),
              status: String(item.status || 'unknown'),
              _original: item
            };
          } catch (itemError) {
            console.error('Error processing item:', itemError, item);
            return {
              key: `error-${index}`,
              id_klaim: `error-${index}`,
              id_laporan_cocok: 'Error',
              nama_satpam: 'Error loading',
              satpam_role: 'unknown',
              satpam_email: '',
              nama_penerima: 'Error loading',
              penerima_role: 'unknown',
              penerima_email: '',
              no_hp_penerima: '',
              foto_klaim: null,
              waktu_terima: 'Error',
              status: 'error',
              _original: item
            };
          }
        })
      );

      setData(transformedData);

    } catch (error) {
      console.error('Error fetching klaim:', error);
      setError(error.message || 'Gagal memuat data klaim');
      message.error('Gagal memuat data klaim: ' + (error.message || 'Terjadi kesalahan'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKlaim();
  }, []);

  const getStatusColor = (status) => {
    switch (String(status).toLowerCase()) {
      case 'selesai': return 'green';
      case 'proses': return 'orange';
      case 'pending': return 'yellow';
      case 'ditolak': return 'red';
      case 'error': return 'red';
      default: return 'default';
    }
  };

  const getRoleColor = (role) => {
    switch (String(role).toLowerCase()) {
      case 'admin': return 'red';
      case 'satpam': return 'blue';
      case 'user': return 'green';
      case 'tamu': return 'orange';
      default: return 'default';
    }
  };

  const getRoleIcon = (role) => {
    switch (String(role).toLowerCase()) {
      case 'admin': return '👑';
      case 'satpam': return '🛡️';
      case 'user': return '👤';
      case 'tamu': return '🚶';
      default: return '❓';
    }
  };


  const columns = [
    {
      title: 'ID Klaim',
      dataIndex: 'id_klaim',
      key: 'id_klaim',
      width: '12%',
      render: (text) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          {String(text || 'N/A')}
        </span>
      ),
    },
    {
      title: 'ID Laporan Cocok',
      dataIndex: 'id_laporan_cocok',
      key: 'id_laporan_cocok',
      width: '12%',
      render: (text) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          {String(text || 'N/A')}
        </span>
      ),
    },
    {
      title: 'Nama Satpam',
      key: 'nama_satpam',
      width: '12%',
      render: (_, record) => (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 4
          }}>
            <span style={{ marginRight: 4 }}>
              {getRoleIcon(record.satpam_role)}
            </span>
            <span style={{ fontWeight: 'bold', fontSize: '13px' }}>
              {String(record.nama_satpam || 'Unknown')}
            </span>
          </div>
          <Tag
            color={getRoleColor(record.satpam_role)}
            size="small"
            style={{ fontSize: '10px' }}
          >
            {String(record.satpam_role || 'UNKNOWN').toUpperCase()}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Nama Penerima',
      key: 'nama_penerima',
      width: '12%',
      render: (_, record) => (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 4
          }}>
            <span style={{ marginRight: 4 }}>
              {getRoleIcon(record.penerima_role)}
            </span>
            <span style={{ fontWeight: 'bold', fontSize: '13px' }}>
              {String(record.nama_penerima || 'Unknown')}
            </span>
          </div>
          <Tag
            color={getRoleColor(record.penerima_role)}
            size="small"
            style={{ fontSize: '10px' }}
          >
            {String(record.penerima_role || 'UNKNOWN').toUpperCase()}
          </Tag>
        </div>
      ),
    },
    {
      title: 'No HP Penerima',
      dataIndex: 'no_hp_penerima',
      key: 'no_hp_penerima',
      width: '10%',
      render: (text) => (
        <span style={{ fontSize: '12px' }}>
          {String(text || 'Tidak ada')}
        </span>
      ),
    },
    {
      title: 'Foto Klaim',
      dataIndex: 'foto_klaim',
      key: 'foto_klaim',
      width: '8%',
      align: 'center',
      render: (url) => (
        url ? (
          <Image
            width={50}
            height={50}
            src={url}
            alt="Foto Klaim"
            style={{
              objectFit: 'cover',
              borderRadius: 4,
              border: '1px solid #d9d9d9'
            }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
        ) : (
          <div style={{
            width: 50,
            height: 50,
            background: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            border: '1px solid #d9d9d9'
          }}>
            <span style={{ fontSize: '10px', color: '#999' }}>No Image</span>
          </div>
        )
      ),
    },
    {
      title: 'Waktu Terima',
      dataIndex: 'waktu_terima',
      key: 'waktu_terima',
      width: '12%',
      render: (text) => (
        <div style={{ fontSize: '12px' }}>
          <ClockCircleOutlined style={{ marginRight: 4, color: '#1890ff' }} />
          {String(text || 'Tidak diketahui')}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '8%',
      align: 'center',
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ fontWeight: 'bold' }}>
          {String(status || 'UNKNOWN').toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Selesai', value: 'selesai' },
        { text: 'Proses', value: 'proses' },
        { text: 'Pending', value: 'pending' },
        { text: 'Ditolak', value: 'ditolak' },
      ],
      onFilter: (value, record) => String(record.status).toLowerCase() === value,
    },
    {
      title: 'Aksi',
      key: 'aksi',
      width: '12%',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleDetail(record)}
          >
            Detail
          </Button>
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
      title: 'Detail Klaim',
      content: (
        <div style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <strong>ID Klaim:</strong>
            <div style={{
              fontFamily: 'monospace',
              background: '#f5f5f5',
              padding: '4px 8px',
              borderRadius: 4,
              marginTop: 4
            }}>
              {String(record.id_klaim || 'N/A')}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <strong>ID Laporan Cocok:</strong>
            <div style={{
              fontFamily: 'monospace',
              background: '#f5f5f5',
              padding: '4px 8px',
              borderRadius: 4,
              marginTop: 4
            }}>
              {String(record.id_laporan_cocok || 'N/A')}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <strong>Satpam:</strong>
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
                  {getRoleIcon(record.satpam_role)}
                </span>
                <span style={{ fontWeight: 'bold' }}>
                  {String(record.nama_satpam || 'Unknown')}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: 4 }}>
                {String(record.satpam_email || 'Email tidak tersedia')}
              </div>
              <Tag color={getRoleColor(record.satpam_role)} size="small">
                {String(record.satpam_role || 'UNKNOWN').toUpperCase()}
              </Tag>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <strong>Penerima:</strong>
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
                  {getRoleIcon(record.penerima_role)}
                </span>
                <span style={{ fontWeight: 'bold' }}>
                  {String(record.nama_penerima || 'Unknown')}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: 4 }}>
                {String(record.penerima_email || 'Email tidak tersedia')}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: 4 }}>
                📞 {String(record.no_hp_penerima || 'Tidak ada nomor HP')}
              </div>
              <Tag color={getRoleColor(record.penerima_role)} size="small">
                {String(record.penerima_role || 'UNKNOWN').toUpperCase()}
              </Tag>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <strong>Foto Klaim:</strong>
            <div style={{ marginTop: 8 }}>
              {record.foto_klaim ? (
                <Image
                  width={200}
                  src={record.foto_klaim}
                  alt="Foto Klaim"
                  style={{
                    borderRadius: 8,
                    border: '1px solid #d9d9d9'
                  }}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                />
              ) : (
                <div style={{
                  padding: 20,
                  background: '#fafafa',
                  border: '1px dashed #d9d9d9',
                  borderRadius: 8,
                  textAlign: 'center',
                  color: '#999'
                }}>
                  Tidak ada foto klaim
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <strong>Waktu Terima:</strong>
            <div style={{ marginTop: 4, fontSize: '14px' }}>
              <ClockCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              {String(record.waktu_terima || 'Tidak diketahui')}
            </div>
          </div>

          <div style={{ marginBottom: 0 }}>
            <strong>Status:</strong>
            <div style={{ marginTop: 4 }}>
              <Tag color={getStatusColor(record.status)} style={{ fontWeight: 'bold', fontSize: '14px' }}>
                {String(record.status || 'UNKNOWN').toUpperCase()}
              </Tag>
            </div>
          </div>
        </div>
      ),
      width: 700,
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
      const response = await KlaimService.deleteKlaim(selectedRecord.id_klaim);

      if (response && response.message) {
        message.success(response.message);
      } else {
        message.success('Klaim berhasil dihapus');
      }

      setDeleteModalVisible(false);
      setSelectedRecord(null);
      await fetchKlaim();

    } catch (error) {
      console.error('Delete error:', error);
      message.error('Gagal menghapus klaim: ' + (error.message || 'Terjadi kesalahan'));
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setSelectedRecord(null);
  };

  if (error) {
    return (
      <div>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={fetchKlaim}>
              Coba Lagi
            </Button>
          }
          style={{ marginBottom: 16 }}
        />

        <Table
          columns={columns}
          dataSource={[]}
          loading={false}
          locale={{
            emptyText: 'Gagal memuat data klaim'
          }}
          pagination={false}
          style={{
            width: '100%',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            backgroundColor: 'white'
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div style={{
        marginBottom: 16,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0 }}>Daftar Klaim Satpam</h3>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Total: {data.length} klaim
        </div>
      </div>

      <div style={{
        marginBottom: 16,
        padding: 12,
        background: '#f0f8ff',
        border: '1px solid #d6f7ff',
        borderRadius: 8
      }}>
        <div style={{ fontSize: '14px', color: '#1890ff', marginBottom: 8 }}>
          <strong>Status Klaim:</strong>
          <Space style={{ marginLeft: 16 }}>
            <Tag color="green">SELESAI</Tag>
            <Tag color="orange">PROSES</Tag>
            <Tag color="yellow">PENDING</Tag>
            <Tag color="red">DITOLAK</Tag>
          </Space>
        </div>
        <div style={{ fontSize: '14px', color: '#1890ff' }}>
          <strong>Role:</strong>
          <Space style={{ marginLeft: 16 }}>
            <span>👑 <Tag color="red" size="small">ADMIN</Tag></span>
            <span>🛡️ <Tag color="blue" size="small">SATPAM</Tag></span>
            <span>👤 <Tag color="green" size="small">USER</Tag></span>
            <span>🚶 <Tag color="orange" size="small">TAMU</Tag></span>
          </Space>
        </div>

      </div>

      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '40px 0',
          background: 'white',
          borderRadius: 8,
          marginBottom: 16
        }}>
          <Spin size="large" />
          <div style={{ marginTop: 16, color: '#666' }}>
            Memuat data klaim...
          </div>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} klaim`
        }}
        locale={{
          emptyText: loading ? 'Memuat data...' : 'Tidak ada data klaim'
        }}
        style={{
          width: '100%',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          backgroundColor: 'white'
        }}
        scroll={{ x: 1400 }}
      />

      <Modal
        title="Konfirmasi Hapus Klaim"
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
          <p>Apakah Anda yakin ingin menghapus klaim berikut?</p>
          {selectedRecord && (
            <div style={{
              background: '#f5f5f5',
              padding: 16,
              borderRadius: 8,
              margin: '16px 0',
              border: '1px solid #d9d9d9'
            }}>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>ID Klaim:</strong> {String(selectedRecord.id_klaim)}
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Satpam:</strong> {String(selectedRecord.nama_satpam)}
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Penerima:</strong> {String(selectedRecord.nama_penerima)}
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Waktu Terima:</strong> {String(selectedRecord.waktu_terima)}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Status:</strong>
                <Tag color={getStatusColor(selectedRecord.status)} style={{ marginLeft: 8 }}>
                  {String(selectedRecord.status || 'UNKNOWN').toUpperCase()}
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

export default TableSpm;
