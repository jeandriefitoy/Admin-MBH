export default function DashboardPage() {
    return (
        <div className="flex w-full h-full p-4 flex-col overflow-hidden">
            <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
            <div className="grid grid-cols-6 grid-rows-6 gap-4 w-full">
                <div className="col-span-2 gap-2 flex flex-col rounded-xl py-5 px-4 shadow-lg bg-blue-200">
                    <h2 className="text-lg text-blue-500 font-bold">Total Tamu</h2>
                    <h1 className="text-3xl text-blue-500 font-bold">24</h1>
                </div>
                <div className="col-span-2 gap-2 flex flex-col rounded-xl py-5 px-4 shadow-lg bg-yellow-200">
                    <h2 className="text-lg font-bold text-yellow-500">Total Tamu</h2>
                    <h1 className="text-3xl font-bold text-yellow-500">24</h1>
                </div>
                <div className="col-span-2 gap-2 flex flex-col rounded-xl py-5 px-4 shadow-lg bg-green-200">
                    <h2 className="text-lg font-bold text-green-500">Total Tamu</h2>
                    <h1 className="text-3xl font-bold text-green-500">24</h1>
                </div>
                <div className="col-span-2 gap-2 flex flex-col rounded-xl py-5 px-4 shadow-lg bg-red-200">
                    <h2 className="text-lg font-bold text-red-500">Total Tamu</h2>
                    <h1 className="text-3xl font-bold text-red-500">24</h1>
                </div>
                <div className="col-span-2 gap-2 flex flex-col rounded-xl py-5 px-4 shadow-lg col-start-3 bg-pink-200">
                    <h2 className="text-lg text-pink-500 font-bold">Total Tamu</h2>
                    <h1 className="text-3xl font-bold text-pink-500">24</h1>
                </div>
                <div className="col-span-2 gap-2 flex flex-col rounded-xl py-5 px-4 shadow-lg col-start-5 bg-purple-200">
                    <h2 className="text-lg font-bold text-purple-500">Total Tamu</h2>
                    <h1 className="text-3xl font-bold text-purple-500">24</h1>
                </div>
                <div className="col-span-2 gap-2 flex flex-col rounded-xl py-5 px-4 shadow-lg bg-cyan-200">
                    <h2 className="text-lg font-bold text-cyan-500">Total Tamu</h2>
                    <h1 className="text-3xl font-bold text-cyan-500">24</h1>
                </div>
            </div>
        </div>

    )
}