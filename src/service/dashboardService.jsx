import api from './authService';

const DashboardService = {
    getDashboardStats: async () => {
        try {
            const response = await api.makeRequest('/dashboard/stats', {
                method: 'GET',
            });
            return response;
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    },

    // Jika tidak ada endpoint khusus dashboard, kita bisa fetch dari berbagai endpoint
    getAllStats: async () => {
        try {
            const [
                usersResponse,
                laporanResponse,
                kategoriResponse,
                lokasiResponse,
                klaimResponse,
                pencocokanResponse
            ] = await Promise.allSettled([
                api.makeRequest('/users', { method: 'GET' }),
                api.makeRequest('/laporan', { method: 'GET' }),
                api.makeRequest('/kategori', { method: 'GET' }),
                api.makeRequest('/lokasi', { method: 'GET' }),
                api.makeRequest('/klaim', { method: 'GET' }),
                api.makeRequest('/pencocokan', { method: 'GET' })
            ]);

            // Process results, handling both fulfilled and rejected promises
            const processResult = (result) => {
                if (result.status === 'fulfilled') {
                    const data = result.value;
                    if (Array.isArray(data)) return data;
                    if (data && Array.isArray(data.data)) return data.data;
                    if (data && typeof data === 'object') return [data];
                    return [];
                }
                return [];
            };

            const stats = {
                users: processResult(usersResponse),
                laporan: processResult(laporanResponse),
                kategori: processResult(kategoriResponse),
                lokasi: processResult(lokasiResponse),
                klaim: processResult(klaimResponse),
                pencocokan: processResult(pencocokanResponse)
            };

            console.log('Dashboard stats:', stats);
            return stats;
            
        } catch (error) {
            console.error('Error fetching all stats:', error);
            throw error;
        }
    },

    // Method untuk mendapatkan statistik spesifik
    getSpecificStats: async () => {
        try {
            const stats = await this.getAllStats();
            
            // Process laporan data to get more detailed statistics
            const laporanStats = this.processLaporanStats(stats.laporan);
            const userStats = this.processUserStats(stats.users);
            
            return {
                ...stats,
                laporanStats,
                userStats,
                summary: {
                    totalUsers: stats.users.length,
                    totalLaporan: stats.laporan.length,
                    totalKategori: stats.kategori.length,
                    totalLokasi: stats.lokasi.length,
                    totalKlaim: stats.klaim.length,
                    totalPencocokan: stats.pencocokan.length
                }
            };
        } catch (error) {
            console.error('Error getting specific stats:', error);
            throw error;
        }
    },

    processLaporanStats: (laporan) => {
        if (!Array.isArray(laporan)) return {};
        
        return {
            byJenis: {
                hilang: laporan.filter(l => l.jenis_laporan === 'hilang').length,
                temuan: laporan.filter(l => l.jenis_laporan === 'temuan').length
            },
            byStatus: {
                proses: laporan.filter(l => l.status === 'proses').length,
                cocok: laporan.filter(l => l.status === 'cocok').length,
                selesai: laporan.filter(l => l.status === 'selesai').length
            },
            byMonth: this.groupByMonth(laporan),
            recent: laporan
                .sort((a, b) => new Date(b.created_at || b.waktu) - new Date(a.created_at || a.waktu))
                .slice(0, 5)
        };
    },

    processUserStats: (users) => {
        if (!Array.isArray(users)) return {};
        
        return {
            byRole: {
                admin: users.filter(u => u.role === 'admin').length,
                satpam: users.filter(u => u.role === 'satpam').length,
                user: users.filter(u => u.role === 'user' || u.role === 'tamu').length
            },
            total: users.length,
            recent: users
                .sort((a, b) => new Date(b.created_at || b.tanggal_daftar) - new Date(a.created_at || a.tanggal_daftar))
                .slice(0, 5)
        };
    },

    groupByMonth: (data) => {
        const months = {};
        data.forEach(item => {
            const date = new Date(item.created_at || item.waktu || Date.now());
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            months[monthKey] = (months[monthKey] || 0) + 1;
        });
        return months;
    }
};

export default DashboardService;
