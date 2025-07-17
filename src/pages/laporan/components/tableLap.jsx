import React, { useState, useEffect, useRef } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  message, 
  Image, 
  Input,
  Select,
  Spin
} from 'antd';
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import LaporanService from '../../../service/laporanService';
import LokasiService from '../../../service/lokasiService';
import KategoriService from '../../../service/kategoriService';
import api from '../../../service/authService';

const { Search } = Input;
const { Option } = Select;

const LaporanTable = ({ refreshTrigger, onEdit }) => {
  const [data, setData] = useState([]);
  const [lokasi, setLokasi] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [userCache, setUserCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filters, setFilters] = useState({
    jenis_laporan: '',
    status: '',
    search: ''
  });

  const kategoriRef = useRef([]);
  const lokasiRef = useRef([]);
  const isInitialLoadRef = useRef(true);

  const fetchKategori = async () => {
    try {
      const response = await KategoriService.getAllKategori();      
      if (Array.isArray(response) && response.length > 0) {
        kategoriRef.current = response;
        setKategori(response);
      } else {
        console.error('Kategori response is not a valid array');
      }
    } catch (error) {
      console.error('Error fetching kategori:', error);
    }
  };

  const fetchLokasi = async () => {
    try {
      const response = await LokasiService.getAllLokasi();
      
      let lokasiData = [];
      if (Array.isArray(response)) {
        lokasiData = response;
      } else if (response && Array.isArray(response.data)) {
        lokasiData = response.data;
      }
      
      if (lokasiData.length > 0) {
        lokasiRef.current = lokasiData;
        setLokasi(lokasiData);
      }
    } catch (error) {
      console.error('Error fetching lokasi:', error);
    }
  };

  const getUserData = async (userId) => {
    if (!userId) {
      return { name: 'Unknown User', email: 'N/A', role: 'user' };
    }
    
    if (userCache[userId]) {
      return userCache[userId];
    }

    try {
      const userData = await api.getUserById(userId);
      const userInfo = {
        name: userData.username || userData.nama || userData.name || 'Unknown User',
        email: userData.email || 'N/A',
        role: userData.role || 'user'
      };
      
      setUserCache(prev => ({ ...prev, [userId]: userInfo }));
      return userInfo;
    } catch (error) {
      console.error('Error fetching user data:', error);
      const fallbackInfo = {
        name: `User ${String(userId).substring(0, 8)}...`,
        email: 'N/A',
        role: 'user'
      };
      
      setUserCache(prev => ({ ...prev, [userId]: fallbackInfo }));
      return fallbackInfo;
    }
  };

  const getKategoriName = (kategoriId) => {
    
    if (!kategoriId) return 'No Category ID';
    const kategoriData = kategoriRef.current.length > 0 ? kategoriRef.current : kategori;
    
    if (!Array.isArray(kategoriData) || kategoriData.length === 0) {
      return 'Loading...';
    }
    
    const foundKategori = kategoriData.find(kat => 
      kat.id_kategori === kategoriId || String(kat.id_kategori) === String(kategoriId)
    );
    
    if (foundKategori) {
      return foundKategori.nama_kategori || 'Unnamed Category';
    }
    return `Unknown (${String(kategoriId)})`;
  };

  const getLokasiName = (lokasiId) => {
    if (!lokasiId) return 'Tidak diketahui';
    const lokasiData = lokasiRef.current.length > 0 ? lokasiRef.current : lokasi;
    
    if (!Array.isArray(lokasiData) || lokasiData.length === 0) {
      return 'Tidak diketahui';
    }
    
    const foundLokasi = lokasiData.find(loc => 
      loc.id === lokasiId || 
      loc.id_lokasi === lokasiId ||
      loc.id_lokasi_klaim === lokasiId ||
      loc._id === lokasiId
    );
    
    if (foundLokasi) {
      return foundLokasi.nama_lokasi || foundLokasi.lokasi_klaim || foundLokasi.nama || foundLokasi.lokasi || 'Tidak diketahui';
    }
    
    return String(lokasiId);
  };

  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.jenis_laporan) params.jenis_laporan = filters.jenis_laporan;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      
      const response = await LaporanService.getAllLaporan(params);
      
      let laporanData = [];
      if (Array.isArray(response)) {
        laporanData = response;
      } else if (response && Array.isArray(response.data)) {
        laporanData = response.data;
      } else if (response && Array.isArray(response.laporan)) {
        laporanData = response.laporan;
      }

      const processedData = await Promise.all(
        laporanData.map(async (item) => {
          const userData = await getUserData(item.id_user || item.user_id || item.pelapor_id);
          const kategoriId = item.id_kategori || item.kategori_id || item.kategori;
          
          return {
            key: item.id_laporan || item.id || Math.random().toString(),
            id_laporan: item.id_laporan || item.id || 'N/A',
            pelapor: userData.name,
            pelapor_email: userData.email,
            pelapor_role: userData.role,
            id_user: item.id_user || item.user_id || item.pelapor_id,
            kategori: getKategoriName(kategoriId),
            id_kategori: kategoriId,
            nama_barang: item.nama_barang || item.nama_jenis || 'Unknown',
            jenis_laporan: item.jenis_laporan || item.jenis || 'unknown',
            lokasi_kejadian: item.lokasi_kejadian || item.lokasi || 'Unknown',
            lokasi_klaim: getLokasiName(item.lokasi_klaim || item.id_lokasi_klaim),
            foto: processPhotos(item.url_foto || item.foto || item.gambar || item.images),
            status: item.status || 'proses',
            waktu: formatDateTime(item.waktu_laporan || item.created_at || item.tanggal),
            deskripsi: item.deskripsi || item.keterangan || 'Tidak ada deskripsi',
            _original: item
          };
        })
      );
      
      setData(processedData);
      
    } catch (error) {
      console.error('Error fetching laporan:', error);
      message.error('Gagal memuat data laporan: ' + (error.message || 'Terjadi kesalahan'));
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      await fetchKategori();
      await fetchLokasi();
      setTimeout(() => {
        fetchLaporan();
        isInitialLoadRef.current = false;
      }, 500);
    };
    
    loadAllData();
  }, [refreshTrigger]);
  useEffect(() => {
    if (!isInitialLoadRef.current && kategoriRef.current.length > 0) {
      const timeoutId = setTimeout(() => {
        fetchLaporan();
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [filters]);
  const processPhotos = (photos) => {
    if (!photos) return [];
    
    if (typeof photos === 'string') {
      try {
        const parsed = JSON.parse(photos);
        return Array.isArray(parsed) ? parsed : [photos];
      } catch {
        return [photos];
      }
    }
    
    if (Array.isArray(photos)) {
      return photos;
    }
    
    return [];
  };

  const formatDateTime = (dateTime) => {
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

  const getStatusColor = (status) => {
    const colors = {
      'proses': 'orange',
      'cocok': 'blue',
      'selesai': 'green'
    };
    return colors[String(status).toLowerCase()] || 'default';
  };

  const getJenisColor = (jenis) => {
    const colors = {
      'hilang': 'red',
      'temuan': 'green'
    };
    return colors[String(jenis).toLowerCase()] || 'default';
  };

  const getRoleColor = (role) => {
    const colors = {
      'admin': 'red',
      'satpam': 'blue',
      'user': 'green',
      'tamu': 'orange'
    };
    return colors[String(role).toLowerCase()] || 'default';
  };
  const columns = [
    {
      title: 'ID Laporan',
      dataIndex: 'id_laporan',
      key: 'id_laporan',
      width: '10%',
      render: (text) => (
        <span style={{ 
          fontFamily: 'monospace', 
          fontSize: '12px',
          background: '#f5f5f5',
          padding: '2px 6px',
          borderRadius: '4px'
        }}>
          {String(text).substring(0, 12)}...
        </span>
      ),
    },
    {
      title: 'Pelapor',
      dataIndex: 'pelapor',
      key: 'pelapor',
      width: '12%',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 2 }}>
            <UserOutlined style={{ marginRight: 4, color: '#1890ff' }} />
            {String(text)}
          </div>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: 2 }}>
            {String(record.pelapor_email)}
          </div>
          <Tag color={getRoleColor(record.pelapor_role)} size="small">
            {String(record.pelapor_role || 'USER').toUpperCase()}
          </Tag>
          <div style={{ fontSize: '10px', color: '#999', marginTop: 2 }}>
            ID: {String(record.id_user).substring(0, 8)}...
          </div>
        </div>
      ),
    },
    {
      title: 'Nama Barang',
      dataIndex: 'nama_barang',
      key: 'nama_barang',
      width: '15%',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
            {String(text)}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Kategori: {String(record.kategori)}
          </div>
          <Tag color={getJenisColor(record.jenis_laporan)} size="small" style={{ marginTop: 4 }}>
            {String(record.jenis_laporan || 'UNKNOWN').toUpperCase()}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Lokasi',
      key: 'lokasi',
      width: '12%',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontSize: '11px', color: '#666' }}>Kejadian:</div>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
              <EnvironmentOutlined style={{ marginRight: 4, color: '#1890ff' }} />
              {String(record.lokasi_kejadian)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#666' }}>Klaim:</div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#52c41a' }}>
              <EnvironmentOutlined style={{ marginRight: 4, color: '#52c41a' }} />
              {String(record.lokasi_klaim)}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Foto',
      dataIndex: 'foto',
      key: 'foto',
      width: '8%',
      align: 'center',
      render: (photos) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {Array.isArray(photos) && photos.length > 0 ? (
            <Image.PreviewGroup>
              <Image
                width={50}
                height={50}
                src={photos[0]}
                alt="Foto barang"
                style={{ 
                  objectFit: 'cover',
                  borderRadius: 4,
                  border: '1px solid #d9d9d9'
                }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
              />
              {photos.length > 1 && (
                <div style={{ fontSize: '10px', color: '#666', marginTop: 2 }}>
                  +{photos.length - 1} foto
                </div>
              )}
              {photos.slice(1).map((photo, index) => (
                <Image
                  key={index}
                  width={0}
                  height={0}
                  src={photo}
                  style={{ display: 'none' }}
                />
              ))}
            </Image.PreviewGroup>
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
          )}
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
    },
    {
      title: 'Waktu',
      dataIndex: 'waktu',
      key: 'waktu',
      width: '10%',
      render: (waktu) => (
        <div style={{ fontSize: '12px' }}>
          <ClockCircleOutlined style={{ marginRight: 4, color: '#1890ff' }} />
          {String(waktu)}
        </div>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      width: '15%',
      align: 'center',
      render: (_, record) => (
        <Space size="small" direction="vertical">
          <Space size="small">
            <Button
              type="default"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => showDetailModal(record)}
              style={{ fontSize: '11px' }}
            >
              Detail
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit(record)}
              style={{ fontSize: '11px' }}
            >
              Edit
            </Button>
          </Space>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => showDeleteModal(record)}
            style={{ fontSize: '11px', width: '100%' }}
          >
            Hapus
          </Button>
        </Space>
      ),
    },
  ];

  const showDetailModal = (record) => {
    Modal.info({
      title: `Detail Laporan - ${record.nama_barang}`,
      width: 800,
      content: (
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <div style={{ marginBottom: 16 }}>
            <h4>Informasi Pelapor</h4>
            <p><strong>Nama:</strong> {record.pelapor}</p>
            <p><strong>Email:</strong> {record.pelapor_email}</p>
            <p><strong>Role:</strong> 
              <Tag color={getRoleColor(record.pelapor_role)} style={{ marginLeft: 8 }}>
                {String(record.pelapor_role).toUpperCase()}
              </Tag>
            </p>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <h4>Informasi Barang</h4>
            <p><strong>Nama Barang:</strong> {record.nama_barang}</p>
            <p><strong>Kategori:</strong> {record.kategori}</p>
            <p><strong>Jenis Laporan:</strong> 
              <Tag color={getJenisColor(record.jenis_laporan)} style={{ marginLeft: 8 }}>
                {String(record.jenis_laporan).toUpperCase()}
              </Tag>
            </p>
            <p><strong>Status:</strong> 
              <Tag color={getStatusColor(record.status)} style={{ marginLeft: 8 }}>
                {String(record.status).toUpperCase()}
              </Tag>
            </p>
            <p><strong>Deskripsi:</strong> {record.deskripsi}</p>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <h4>Informasi Lokasi</h4>
            <p><strong>Lokasi Kejadian:</strong> {record.lokasi_kejadian}</p>
            <p><strong>Lokasi Klaim:</strong> {record.lokasi_klaim}</p>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <h4>Waktu</h4>
            <p><strong>Dilaporkan:</strong> {record.waktu}</p>
          </div>
          
          {Array.isArray(record.foto) && record.foto.length > 0 && (
            <div>
              <h4>Foto Barang</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Image.PreviewGroup>
                  {record.foto.map((photo, index) => (
                    <Image
                      key={index}
                      width={100}
                      height={100}
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      style={{ 
                        objectFit: 'cover',
                        borderRadius: 4,
                        border: '1px solid #d9d9d9'
                      }}
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                    />
                  ))}
                </Image.PreviewGroup>
              </div>
            </div>
          )}
        </div>
      ),
      onOk() {},
    });
  };

  const showDeleteModal = (record) => {
    setSelectedRecord(record);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedRecord) return;
    
    setDeleteLoading(true);
    try {
      await LaporanService.deleteLaporan(selectedRecord.id_laporan);
      message.success('Laporan berhasil dihapus');
      setDeleteModalVisible(false);
      setSelectedRecord(null);
      fetchLaporan(); // Refresh data
    } catch (error) {
      console.error('Error deleting laporan:', error);
      message.error('Gagal menghapus laporan: ' + (error.message || 'Terjadi kesalahan'));
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setSelectedRecord(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = (value) => {
    setFilters(prev => ({
      ...prev,
      search: value
    }));
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Filter Controls */}
      <div style={{ 
        marginBottom: 16, 
        padding: 16, 
        background: 'white', 
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: 12, 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <Select
            placeholder="Semua Jenis"
            style={{ width: 150 }}
            value={filters.jenis_laporan}
            onChange={(value) => handleFilterChange('jenis_laporan', value)}
            allowClear
          >
            <Option value="hilang">Hilang</Option>
            <Option value="temuan">Temuan</Option>
          </Select>
          
          <Select
            placeholder="Semua Status"
            style={{ width: 150 }}
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
            allowClear
          >
            <Option value="proses">Proses</Option>
            <Option value="cocok">Cocok</Option>
            <Option value="selesai">Selesai</Option>
          </Select>
          
          <Search
            placeholder="Cari pelapor atau nama barang..."
            style={{ width: 300 }}
            onSearch={handleSearch}
            onChange={(e) => {
              if (e.target.value === '') {
                handleSearch('');
              }
            }}
            allowClear
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 16, 
        marginBottom: 16 
      }}>
        <div style={{ 
          padding: 16, 
          background: '#fff2e8', 
          border: '1px solid #ffbb96',
          borderRadius: 8,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d4380d' }}>
            {data.length}
          </div>
          <div style={{ fontSize: '12px', color: '#d4380d' }}>Total Laporan</div>
        </div>
        
        <div style={{ 
          padding: 12, 
          background: '#fff1f0', 
          border: '1px solid #ffa39e',
          borderRadius: 8,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f5222d' }}>
            {data.filter(item => item.jenis_laporan === 'hilang').length}
          </div>
          <div style={{ fontSize: '12px', color: '#f5222d' }}>Hilang</div>
        </div>
        
        <div style={{ 
          padding: 12, 
          background: '#f6ffed', 
          border: '1px solid #b7eb8f',
          borderRadius: 8,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
            {data.filter(item => item.jenis_laporan === 'temuan').length}
          </div>
          <div style={{ fontSize: '12px', color: '#52c41a' }}>Temuan</div>
        </div>
        
        <div style={{ 
          padding: 12, 
          background: '#fff7e6', 
          border: '1px solid #ffd591',
          borderRadius: 8,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#d4380d' }}>
            {data.filter(item => item.status === 'proses').length}
          </div>
          <div style={{ fontSize: '12px', color: '#d4380d' }}>Proses</div>
        </div>
        
        <div style={{ 
          padding: 12, 
          background: '#e6f7ff', 
          border: '1px solid #91d5ff',
          borderRadius: 8,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
            {data.filter(item => item.status === 'cocok').length}
          </div>
          <div style={{ fontSize: '12px', color: '#1890ff' }}>Cocok</div>
        </div>
        
        <div style={{ 
          padding: 12, 
          background: '#f6ffed', 
          border: '1px solid #b7eb8f',
          borderRadius: 8,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
            {data.filter(item => item.status === 'selesai').length}
          </div>
          <div style={{ fontSize: '12px', color: '#52c41a' }}>Selesai</div>
        </div>
      </div>

      {/* Loading State */}
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
            Memuat data laporan...
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ marginBottom: '3rem' }}> 
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} laporan`
          }}
          locale={{
            emptyText: loading ? 'Memuat data...' : 'Tidak ada data laporan'
          }}
          style={{ 
            width: '100%', 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
            borderRadius: '8px',
            backgroundColor: 'white'
          }}
          scroll={{ x: 1600 }}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Konfirmasi Hapus Laporan"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Ya, Hapus"
                cancelText="Batal"
        confirmLoading={deleteLoading}
        okButtonProps={{ danger: true }}
      >
        <div>
          <p>Apakah Anda yakin ingin menghapus laporan ini?</p>
          {selectedRecord && (
            <div style={{ 
              background: '#f5f5f5', 
              padding: 12, 
              borderRadius: 6,
              marginTop: 12
            }}>
              <p><strong>ID Laporan:</strong> {selectedRecord.id_laporan}</p>
              <p><strong>Nama Barang:</strong> {selectedRecord.nama_barang}</p>
              <p><strong>Pelapor:</strong> {selectedRecord.pelapor}</p>
              <p><strong>Jenis:</strong> 
                <Tag color={getJenisColor(selectedRecord.jenis_laporan)} style={{ marginLeft: 8 }}>
                  {String(selectedRecord.jenis_laporan).toUpperCase()}
                </Tag>
              </p>
            </div>
          )}
          <div style={{ 
            marginTop: 12, 
            padding: 8, 
            background: '#fff2f0', 
            border: '1px solid #ffccc7',
            borderRadius: 4,
            color: '#cf1322'
          }}>
            <strong>Peringatan:</strong> Tindakan ini tidak dapat dibatalkan!
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LaporanTable;
