import Table from './components/tableSpm';

export default function KlaimSatpamPage() {
    return (
        <div className="w-full flex h-full p-4 flex-col">
            <div className="flex flex-row justify-start items-center mb-4">
                <h1 className="text-2xl font-bold">Manajemen Klaim</h1>
            </div>
            <div className="flex w-full h-full mt-10">
                <Table />
            </div>
        </div>
    )
}