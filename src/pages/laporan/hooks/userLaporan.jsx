import { useState, useEffect } from 'react';
import { message } from 'antd';
import laporanService from '../../../service/laporanService';

export const useLaporan = (filters = {}) => {
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLaporan = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await laporanService.getAllLaporan(filters);
      const formattedData = Array.isArray(data) ? data.map(item => ({
        ...item,
        key: item.id_laporan, 
        id_laporan: item.id_laporan || '',
        id_kategori: item.id_kategori || '',
        id_user: item.id_user || '',
        id_lokasi_klaim: item.id_lokasi_klaim || '',
        lokasi_kejadian: item.lokasi_kejadian || '',
        nama_barang: item.nama_barang || '',
        jenis_laporan: item.jenis_laporan || '',
        url_foto: item.url_foto || [],
        deskripsi: item.deskripsi || '',
        waktu_laporan: item.waktu_laporan || new Date().toISOString(),
        status: item.status || 'proses'
      })) : [];
      
      setLaporan(formattedData);
    } catch (err) {
      setError(err.message);
      message.error('Gagal memuat data laporan');
      console.error('Error fetching laporan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, [JSON.stringify(filters)]);

  const refetch = () => {
    fetchLaporan();
  };

  return {
    laporan,
    loading,
    error,
    refetch
  };
};

export const useLaporanDetail = (id_laporan) => {
  const [laporan, setLaporan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLaporanDetail = async () => {
    if (!id_laporan) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await laporanService.getLaporanById(id_laporan);
      
      // Ensure proper structure
      const formattedData = {
        ...data,
        // Ensure required fields exist
        id_laporan: data.id_laporan || '',
        id_kategori: data.id_kategori || '',
        id_user: data.id_user || '',
        id_lokasi_klaim: data.id_lokasi_klaim || '',
        lokasi_kejadian: data.lokasi_kejadian || '',
        nama_barang: data.nama_barang || '',
        jenis_laporan: data.jenis_laporan || '',
        url_foto: data.url_foto || [],
        deskripsi: data.deskripsi || '',
        waktu_laporan: data.waktu_laporan || new Date().toISOString(),
        status: data.status || 'proses'
      };
      
      setLaporan(formattedData);
    } catch (err) {
      setError(err.message);
      message.error('Gagal memuat detail laporan');
      console.error('Error fetching laporan detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporanDetail();
  }, [id_laporan]);

  return {
    laporan,
    loading,
    error,
    refetch: fetchLaporanDetail
  };
};

export const useLaporanActions = () => {
  const [loading, setLoading] = useState(false);

  const createLaporan = async (data) => {
    try {
      setLoading(true);
      const result = await laporanService.createLaporan(data);
      message.success('Laporan berhasil dibuat');
      return result;
    } catch (error) {
      message.error(error.response?.data?.message || 'Gagal membuat laporan');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateLaporan = async (id_laporan, data) => {
    try {
      setLoading(true);
      const result = await laporanService.updateLaporan(id_laporan, data);
      message.success('Laporan berhasil diupdate');
      return result;
    } catch (error) {
      message.error(error.response?.data?.message || 'Gagal mengupdate laporan');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStatusLaporan = async (id_laporan, status) => {
    try {
      setLoading(true);
      const result = await laporanService.updateStatusLaporan(id_laporan, status);
      message.success('Status laporan berhasil diupdate');
      return result;
    } catch (error) {
      message.error(error.response?.data?.message || 'Gagal mengupdate status laporan');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteLaporan = async (id_laporan) => {
    try {
      setLoading(true);
           const result = await laporanService.deleteLaporan(id_laporan);
      message.success('Laporan berhasil dihapus');
      return result;
    } catch (error) {
      message.error(error.response?.data?.message || 'Gagal menghapus laporan');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createLaporan,
    updateLaporan,
    updateStatusLaporan,
    deleteLaporan,
    loading
  };
};

