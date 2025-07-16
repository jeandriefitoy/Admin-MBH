import React, { useState } from 'react';
import { Modal } from 'antd';
import Table from "./components/tabelUser";
import TambahUser from './components/tambahUser';
import { useUsers } from './hooks/useUser';

export default function UserPage() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const { refetch } = useUsers();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSuccess = () => {
        setIsModalVisible(false);
        refetch();
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleRoleFilterChange = (e) => {
        setRoleFilter(e.target.value);
    };

    return (
        <div className="w-full flex h-full p-4 flex-col">
            <div className="flex flex-row justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
                <button 
                    className="flex flex-row item-center justify-between items-center bg-blue-700 px-4 py-2 rounded-xl hover:bg-blue-800"
                    onClick={showModal}
                >
                    <span className="font-bold text-xl text-white">+</span>
                    <span className="ml-2 font-bold text-xm text-white">Tambah User</span>
                </button>
            </div>

            <div className="flex flex-row gap-2 w-1/2 justify-start items-center mb-4">
                <input 
                    className="border-2 px-2 w-full py-1 rounded-sm" 
                    placeholder="Cari Username, Email, No HP..."
                    value={searchText}
                    onChange={handleSearchChange}
                />
                <select 
                    className="border-2 bg-gray-100 px-2 py-1 rounded-sm"
                    value={roleFilter}
                    onChange={handleRoleFilterChange}
                >
                    <option value="all">Semua Role</option>
                    <option value="admin">Admin</option>
                    <option value="satpam">Satpam</option>
                    <option value="tamu">Tamu</option>
                </select>
            </div>

            <div className="flex w-full h-full mt-6">
                <Table 
                    searchText={searchText}
                    roleFilter={roleFilter}
                />
            </div>

            <Modal
                title="Tambah User Baru"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={600}
                destroyOnClose={true}
            >
                <TambahUser 
                    onCancel={handleCancel}
                    onSuccess={handleSuccess}
                />
            </Modal>
        </div>
    )
}
