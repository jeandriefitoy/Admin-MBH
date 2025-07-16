import Table from './components/tableLap';

export default function LaporanPage() {
    return (
        <div className="w-full flex h-full p-4 flex-col">
            <div className="flex flex-row justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Manajemen Laporan</h1>
                <button className="flex flex-row item-center justify-between items-center bg-blue-700 px-4 py-2 rounded-xl hover:bg-blue-800">
                    <span className="font-bold text-xl text-white">+</span>
                    <span className="ml-2 font-bold text-xm text-white">Tambah Laporan</span>
                </button>
            </div>

            <div className="flex flex-row gap-2 w-[70%] justify-start items-center">
                <select className="border-2 bg-gray-100 px-2 py-1 rounded-sm">
                    <option value="all">Semua Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Satpam">Satpam</option>
                    <option value="Tamu">Tamu</option>
                </select>
                <select className="border-2 bg-gray-100 px-2 py-1 rounded-sm">
                    <option value="all">Semua Status</option>
                    <option value="Admin">Proses</option>
                    <option value="Satpam">Cocok</option>
                    <option value="Tamu">Selesai</option>
                </select>
                <input className="border-2 px-2 w-full py-1 rounded-sm" placeholder="Nama Pelapor..."/>
                <input className="border-2 px-2 w-full py-1 rounded-sm" placeholder="Nama Cari Barang..."/>
                <button className="bg-blue-700 px-4 py-1 rounded-sm text-white hover:bg-blue-800">
                    <span className="font-semibold text-lg">Cari</span>
                </button>
            </div>

            <div className="flex w-full h-full mt-10">
                <Table />
            </div>
        </div>
    )
}