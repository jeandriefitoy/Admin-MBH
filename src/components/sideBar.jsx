import { LayoutDashboard, NotepadText, UserRound, FolderOpen, MapPin, Settings, LogOut } from 'lucide-react';
import authService from '../service/authService'; 

export default function SideBar({ activeSection, onSectionChange, onLogout }) {
    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'user', icon: UserRound, label: 'User' },
        { id: 'laporan', icon: NotepadText, label: 'Laporan' },
        { id: 'kategori', icon: FolderOpen, label: 'Kategori' },
        { id: 'lokasi', icon: MapPin, label: 'Lokasi' },
        { id: 'pencocokan', icon: Settings, label: 'Pencocokan' },
        { id: 'klaimSatpam', icon: NotepadText, label: 'Klaim Satpam' }
    ];

    const handleLogout = () => {
        if (window.confirm('Apakah Anda yakin ingin keluar?')) {
            authService.logout()
            onLogout();
        }
    }

    return (
        <div className=" flex flex-col items-start justify-start h-screen w-66 bg-gradient-to-bl from-[#0f172a] via-[#1e1a78] to-[#0f172a] text-white overflow-hidden">
            <div className="flex px-5 py-6 border-b-2 border-[#1e1a78] w-full ">
                <div className="flex flex-col gap-1 w-full">
                    <h2 className="text-xl font-bold ">Admin Panel</h2>
                    <p className="text-sm font-semibold">Manajemen Barang Hilang</p>
                </div>
            </div>

            <div className='flex flex-col h-full justify-between w-full'>
                <div className="flex flex-col gap-1 py-3 w-full items-start justify-start">
                    {menuItems.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = activeSection === item.id;

                        return (
                            <div
                                key={item.id}
                                className={`flex items-center justify-start gap-2 px-5 py-3 w-full cursor-pointer rounded-xl transition-colors ${isActive
                                        ? 'bg-blue-500 text-white'
                                        : 'hover:bg-blue-400 hover:text-white'
                                    }`}
                                onClick={() => onSectionChange(item.id)}
                            >
                                <IconComponent size={20} />
                                <span className="text-lg font-normal">{item.label}</span>
                            </div>
                        );
                    })}
                </div>

                <div 
                className='flex flex-row items-center justify-start gap-2 px-5 py-3 mb-7 w-full cursor-pointer rounded-xl transition-colors hover:bg-blue-400 hover:text-white'
                onClick={handleLogout}
                >
                    <LogOut size={20} />
                    <p className="text-lg font-normal">Logout</p>
                </div>
            </div>
        </div>
    )
}
