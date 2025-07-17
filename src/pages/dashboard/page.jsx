import React, { useState, useEffect } from 'react';
import { Spin, Alert, Card, Row, Col, Statistic, Progress } from 'antd';
import { 
    UserOutlined, 
    FileTextOutlined, 
    TagsOutlined, 
    EnvironmentOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    TrophyOutlined
} from '@ant-design/icons';
import DashboardService from '../../service/dashboardService';

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalLaporan: 0,
        totalKategori: 0,
        totalLokasi: 0,
        totalKlaim: 0,
        totalPencocokan: 0,
        laporanHilang: 0,
        laporanTemuan: 0,
        laporanProses: 0,
        laporanCocok: 0,
        laporanSelesai: 0,
        usersByRole: {
            admin: 0,
            satpam: 0,
            user: 0
        }
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            let data;
            try {
                data = await DashboardService.getDashboardStats();
            } catch (dashboardError) {
                data = await DashboardService.getAllStats();
            }
            const processedStats = {
                totalUsers: data.users?.length || 0,
                totalLaporan: data.laporan?.length || 0,
                totalKategori: data.kategori?.length || 0,
                totalLokasi: data.lokasi?.length || 0,
                totalKlaim: data.klaim?.length || 0,
                totalPencocokan: data.pencocokan?.length || 0,
                laporanHilang: data.laporan?.filter(l => l.jenis_laporan === 'hilang').length || 0,
                laporanTemuan: data.laporan?.filter(l => l.jenis_laporan === 'temuan').length || 0,
                laporanProses: data.laporan?.filter(l => l.status === 'proses').length || 0,
                laporanCocok: data.laporan?.filter(l => l.status === 'cocok').length || 0,
                laporanSelesai: data.laporan?.filter(l => l.status === 'selesai').length || 0,
                usersByRole: {
                    admin: data.users?.filter(u => u.role === 'admin').length || 0,
                    satpam: data.users?.filter(u => u.role === 'satpam').length || 0,
                    user: data.users?.filter(u => u.role === 'tamu').length || 0
                }
            };

            setStats(processedStats);
            
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError(error.message || 'Gagal memuat data dashboard');
        } finally {
            setLoading(false);
        }
    };

    const getCompletionRate = () => {
        const total = stats.totalLaporan;
        if (total === 0) return 0;
        return Math.round((stats.laporanSelesai / total) * 100);
    };

    const getMatchingRate = () => {
        const total = stats.totalLaporan;
        if (total === 0) return 0;
        return Math.round(((stats.laporanCocok + stats.laporanSelesai) / total) * 100);
    };

    if (loading) {
        return (
            <div className="flex w-full h-full p-4 flex-col items-center justify-center">
                <Spin size="large" />
                <div style={{ marginTop: 16, fontSize: '16px', color: '#666' }}>
                    Memuat data dashboard...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex w-full h-full p-4 flex-col">
                <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    action={
                        <button 
                            onClick={fetchDashboardData}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Coba Lagi
                        </button>
                    }
                />
            </div>
        );
    }

    return (
        <div className="flex w-full h-full p-4 flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Dashboard Admin</h1>
                <button 
                    onClick={fetchDashboardData}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                    disabled={loading}
                >
                    <ClockCircleOutlined />
                    Refresh Data
                </button>
            </div>

            {/* Main Statistics Cards */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card className="shadow-lg border-l-4 border-l-blue-500">
                        <Statistic
                            title="Total Users"
                            value={stats.totalUsers}
                            prefix={<UserOutlined className="text-blue-500" />}
                            valueStyle={{ color: '#1890ff', fontSize: '28px', fontWeight: 'bold' }}
                        />
                        <div className="mt-2 text-sm text-gray-500">
                            Admin: {stats.usersByRole.admin} | Satpam: {stats.usersByRole.satpam} | User: {stats.usersByRole.user}
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card className="shadow-lg border-l-4 border-l-yellow-500">
                        <Statistic
                            title="Total Laporan"
                            value={stats.totalLaporan}
                            prefix={<FileTextOutlined className="text-yellow-500" />}
                            valueStyle={{ color: '#faad14', fontSize: '28px', fontWeight: 'bold' }}
                        />
                        <div className="mt-2 text-sm text-gray-500">
                            Hilang: {stats.laporanHilang} | Temuan: {stats.laporanTemuan}
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card className="shadow-lg border-l-4 border-l-green-500">
                        <Statistic
                            title="Total Kategori"
                            value={stats.totalKategori}
                            prefix={<TagsOutlined className="text-green-500" />}
                            valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card className="shadow-lg border-l-4 border-l-purple-500">
                        <Statistic
                            title="Total Lokasi"
                            value={stats.totalLokasi}
                            prefix={<EnvironmentOutlined className="text-purple-500" />}
                            valueStyle={{ color: '#722ed1', fontSize: '28px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Status Statistics */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={8}>
                    <Card className="shadow-lg border-l-4 border-l-orange-500">
                        <Statistic
                            title="Laporan Proses"
                            value={stats.laporanProses}
                            prefix={<ClockCircleOutlined className="text-orange-500" />}
                            valueStyle={{ color: '#fa8c16', fontSize: '24px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={8}>
                    <Card className="shadow-lg border-l-4 border-l-blue-500">
                        <Statistic
                            title="Laporan Cocok"
                            value={stats.laporanCocok}
                            prefix={<ExclamationCircleOutlined className="text-blue-500" />}
                            valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={8}>
                    <Card className="shadow-lg border-l-4 border-l-green-500">
                        <Statistic
                            title="Laporan Selesai"
                            value={stats.laporanSelesai}
                            prefix={<CheckCircleOutlined className="text-green-500" />}
                            valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Additional Statistics */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12}>
                    <Card className="shadow-lg border-l-4 border-l-cyan-500">
                        <Statistic
                            title="Total Klaim"
                            value={stats.totalKlaim}
                            prefix={<TrophyOutlined className="text-cyan-500" />}
                            valueStyle={{ color: '#13c2c2', fontSize: '24px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12}>
                    <Card className="shadow-lg border-l-4 border-l-pink-500">
                        <Statistic
                            title="Total Pencocokan"
                            value={stats.totalPencocokan}
                            prefix={<ExclamationCircleOutlined className="text-pink-500" />}
                            valueStyle={{ color: '#eb2f96', fontSize: '24px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Progress Indicators */}
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card className="shadow-lg" title="Tingkat Penyelesaian Laporan">
                        <Progress
                            type="circle"
                            percent={getCompletionRate()}
                            format={percent => `${percent}%`}
                            strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                            }}
                            size={120}
                        />
                        <div className="mt-4 text-center text-gray-600">
                            {stats.laporanSelesai} dari {stats.totalLaporan} laporan selesai
                        </div>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card className="shadow-lg" title="Tingkat Pencocokan">
                        <Progress
                            type="circle"
                            percent={getMatchingRate()}
                            format={percent => `${percent}%`}
                            strokeColor={{
                                '0%': '#ffa940',
                                '100%': '#36cfc9',
                            }}
                            size={120}
                        />
                        <div className="mt-4 text-center text-gray-600">
                            {stats.laporanCocok + stats.laporanSelesai} dari {stats.totalLaporan} laporan tercocokkan
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Quick Stats Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Ringkasan Sistem</h3>                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                        <div className="font-bold text-blue-600 text-lg">{stats.totalUsers}</div>
                        <div className="text-gray-600">Total Pengguna</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-yellow-600 text-lg">{stats.totalLaporan}</div>
                        <div className="text-gray-600">Total Laporan</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-green-600 text-lg">{stats.totalKategori}</div>
                        <div className="text-gray-600">Kategori Barang</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-purple-600 text-lg">{stats.totalLokasi}</div>
                        <div className="text-gray-600">Lokasi Tersedia</div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Summary */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-lg" title="Status Laporan">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                            <div className="flex items-center">
                                <ClockCircleOutlined className="text-orange-500 mr-2" />
                                <span>Dalam Proses</span>
                            </div>
                            <span className="font-bold text-orange-600">{stats.laporanProses}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                            <div className="flex items-center">
                                <ExclamationCircleOutlined className="text-blue-500 mr-2" />
                                <span>Sudah Cocok</span>
                            </div>
                            <span className="font-bold text-blue-600">{stats.laporanCocok}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                            <div className="flex items-center">
                                <CheckCircleOutlined className="text-green-500 mr-2" />
                                <span>Selesai</span>
                            </div>
                            <span className="font-bold text-green-600">{stats.laporanSelesai}</span>
                        </div>
                    </div>
                </Card>

                <Card className="shadow-lg" title="Distribusi Pengguna">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                            <div className="flex items-center">
                                <UserOutlined className="text-red-500 mr-2" />
                                <span>Administrator</span>
                            </div>
                            <span className="font-bold text-red-600">{stats.usersByRole.admin}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                            <div className="flex items-center">
                                <UserOutlined className="text-blue-500 mr-2" />
                                <span>Satpam</span>
                            </div>
                            <span className="font-bold text-blue-600">{stats.usersByRole.satpam}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                            <div className="flex items-center">
                                <UserOutlined className="text-green-500 mr-2" />
                                <span>Tamu</span>
                            </div>
                            <span className="font-bold text-green-600">{stats.usersByRole.user}</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Performance Metrics */}
            <div className="mt-6">
                <Card className="shadow-lg" title="Metrik Performa Sistem">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={6}>
                            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600 mb-2">
                                    {stats.totalLaporan > 0 ? Math.round((stats.laporanSelesai / stats.totalLaporan) * 100) : 0}%
                                </div>
                                <div className="text-sm text-gray-600">Tingkat Penyelesaian</div>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                                <div className="text-2xl font-bold text-green-600 mb-2">
                                    {stats.totalLaporan > 0 ? Math.round(((stats.laporanCocok + stats.laporanSelesai) / stats.totalLaporan) * 100) : 0}%
                                </div>
                                <div className="text-sm text-gray-600">Tingkat Pencocokan</div>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                                <div className="text-2xl font-bold text-yellow-600 mb-2">
                                    {stats.laporanHilang}
                                </div>
                                <div className="text-sm text-gray-600">Barang Hilang</div>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600 mb-2">
                                    {stats.laporanTemuan}
                                </div>
                                <div className="text-sm text-gray-600">Barang Ditemukan</div>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </div>

            {/* System Health Indicator */}
            <div className="mt-6 mb-4 pb-6">
                <Card className="shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Status Sistem</h3>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                <span className="text-green-600 font-medium">Sistem Berjalan Normal</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">Terakhir diperbarui</div>
                            <div className="text-sm font-medium">
                                {new Date().toLocaleString('id-ID')}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
