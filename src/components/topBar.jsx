export default function TopBar() {
    return (
        <div className="shadow-lg w-full h-16 items-center justify-end flex flex-row px-10 overflow-hidden">
            <div className="flex flex-row gap-3 justify-end items-center">
                <h1 className="text-xl font-bold text-center">Admin</h1>
                <div className="flex justify-center items-center w-10 h-10 rounded-full bg-cover shadow-sm">
                    <img src="uad.png" alt="logo" className="w-full h-full bg-cover"/>
                </div>
            </div>
        </div>
    )
}