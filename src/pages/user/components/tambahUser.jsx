import React, { useState } from 'react';
import { Form, Input, Select, Button, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import authService from '../../../service/authService';

const { Option } = Select;

const TambahUser = ({ onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            console.log('Form values:', values);
            console.log('Selected file:', selectedFile);
            
            // Prepare FormData untuk request
            const formData = new FormData();
            formData.append('email', values.email);
            formData.append('password', values.password);
            formData.append('username', values.username);
            formData.append('no_hp', values.no_hp);
            formData.append('role', values.role);
            
            // Tambahkan file jika ada
            if (selectedFile) {
                formData.append('foto_identitas', selectedFile);
            }

            console.log('FormData entries:');
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            // Call API to create user
            const response = await authService.createUser(formData);
            console.log('API Response:', response);
            
            message.success('User berhasil ditambahkan!');
            form.resetFields();
            setSelectedFile(null);
            setImagePreview('');
            onSuccess();
        } catch (error) {
            console.error('Error creating user:', error);
            message.error(`Gagal menambahkan user: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Props untuk upload component
    const uploadProps = {
        name: 'foto_identitas',
        listType: 'picture-card',
        className: 'avatar-uploader',
        showUploadList: false,
        beforeUpload: (file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('Hanya file JPG/PNG yang diperbolehkan!');
                return false;
            }
            
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Ukuran gambar harus kurang dari 2MB!');
                return false;
            }
            
            // Set file dan preview
            setSelectedFile(file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
            
            message.success('Foto berhasil dipilih!');
            return false; // Prevent default upload behavior
        },
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload Foto</div>
        </div>
    );

    return (
        <div className="w-full">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
                initialValues={{
                    role: 'tamu'
                }}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        { required: true, message: 'Username wajib diisi!' },
                        { min: 3, message: 'Username minimal 3 karakter!' },
                        { whitespace: true, message: 'Username tidak boleh kosong!' }
                    ]}
                >
                    <Input 
                        placeholder="Masukan username..." 
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Email wajib diisi!' },
                        { type: 'email', message: 'Format email tidak valid!' },
                        { whitespace: true, message: 'Email tidak boleh kosong!' }
                    ]}
                >
                    <Input 
                        placeholder="Masukan email..." 
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: 'Password wajib diisi!' },
                        { min: 6, message: 'Password minimal 6 karakter!' },
                        { whitespace: true, message: 'Password tidak boleh kosong!' }
                    ]}
                >
                    <Input.Password 
                        placeholder="Masukan password..." 
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="No HP"
                    name="no_hp"
                    rules={[
                        { required: true, message: 'No HP wajib diisi!' },
                        { pattern: /^[0-9]+$/, message: 'No HP hanya boleh angka!' },
                        { whitespace: true, message: 'No HP tidak boleh kosong!' }
                    ]}
                >
                    <Input 
                        placeholder="Masukan no HP..." 
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="Role"
                    name="role"
                    rules={[
                        { required: true, message: 'Role wajib dipilih!' }
                    ]}
                >
                    <Select 
                        placeholder="Pilih role..." 
                        size="large"
                    >
                        <Option value="admin">Admin</Option>
                        <Option value="satpam">Satpam</Option>
                        <Option value="tamu">Tamu</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Foto Identitas (Opsional)"
                    name="foto_identitas"
                >
                    <div className="upload-container">
                        <Upload {...uploadProps}>
                            {imagePreview ? (
                                <img 
                                    src={imagePreview} 
                                    alt="foto identitas" 
                                    style={{ 
                                        width: '100%', 
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '6px'
                                    }} 
                                />
                            ) : (
                                uploadButton
                            )}
                        </Upload>
                        
                        {selectedFile && (
                            <div style={{ marginTop: 8 }}>
                                <p className="text-sm text-gray-600">
                                    File: {selectedFile.name}
                                </p>
                                <Button 
                                    size="small" 
                                    danger 
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setImagePreview('');
                                        message.info('Foto dihapus');
                                    }}
                                >
                                    Hapus Foto
                                </Button>
                            </div>
                        )}
                    </div>
                    
                    <div style={{ marginTop: 8 }}>
                        <small className="text-gray-500">
                            Format: JPG, PNG. Maksimal 2MB. Upload foto identitas (KTP/SIM/Passport)
                        </small>
                    </div>
                </Form.Item>

                <Form.Item className="mb-0 mt-6">
                    <div className="flex justify-end gap-2">
                        <Button 
                            onClick={onCancel}
                            size="large"
                        >
                            Batal
                        </Button>
                        <Button 
                            type="primary" 
                            htmlType="submit"
                            loading={loading}
                            size="large"
                        >
                            Tambah User
                        </Button>
                    </div>
                </Form.Item>
            </Form>

            <style jsx>{`
                .upload-container .avatar-uploader .ant-upload {
                    width: 128px;
                    height: 128px;
                    border: 2px dashed #d9d9d9;
                    border-radius: 6px;
                    background: #fafafa;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: border-color 0.3s;
                }
                
                .upload-container .avatar-uploader .ant-upload:hover {
                    border-color: #1890ff;
                }
                
                .upload-container .avatar-uploader .ant-upload-select-picture-card i {
                    font-size: 32px;
                    color: #999;
                }
                
                .upload-container .avatar-uploader .ant-upload-select-picture-card .ant-upload-text {
                    margin-top: 8px;
                    color: #666;
                    font-size: 14px;
                }
            `}</style>
        </div>
    );
};

export default TambahUser;
