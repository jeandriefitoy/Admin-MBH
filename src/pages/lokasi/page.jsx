import Table from './components/tableLok';

export default function LokasiPage() {
    return (
        <div className="w-full flex h-full p-4 flex-col">
            <div className="flex flex-row justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Manajemen Lokasi</h1>
                <button className="flex flex-row item-center justify-between items-center bg-blue-700 px-4 py-2 rounded-xl hover:bg-blue-800">
                    <span className="font-bold text-xl text-white">+</span>
                    <span className="ml-2 font-bold text-xm text-white">Tambah Lokasi</span>
                </button>
            </div>

            

            <div className="flex w-full h-full mt-10">
                <Table />
            </div>
        </div>
    )
}