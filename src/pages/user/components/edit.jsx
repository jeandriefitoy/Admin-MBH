import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const EditUser = ({ onCancel, onSuccess, initialData, userId, updateUser }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(initialData?.identityPhoto || '');

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                username: initialData.username,
                email: initialData.email,
                no_hp: initialData.phone,
                role: initialData.role
            });
            setImagePreview(initialData.identityPhoto || '');
        }
    }, [initialData, form]);

    const handleSubmit = async (values) => {
        console.log('Form values:', values);
        if (!values.username || !values.email) {
            message.error('Username dan email wajib diisi!');
            return;
        }

        if (values.username.trim() === '' || values.email.trim() === '') {
            message.error('Username dan email tidak boleh kosong!');
            return;
        }

        setLoading(true);
        try {
            const jsonData = {
                username: values.username.trim(),
                email: values.email.trim(),
                no_hp: values.no_hp?.trim() || '',
                role: values.role
            };

            console.log('Sending JSON data:', jsonData);

            if (selectedFile) {
                const formData = new FormData();
                Object.keys(jsonData).forEach(key => {
                    formData.append(key, jsonData[key]);
                });
                formData.append('foto_identitas', selectedFile);
                for (let [key, value] of formData.entries()) {
                    console.log(key, value);
                }

                await updateUser(userId, formData);
            } else {
                await updateUser(userId, jsonData);
            }
            form.resetFields();
            setSelectedFile(null);
            setImagePreview('');
            onSuccess();
        } catch (error) {
            console.error('Error updating user:', error);
            if (error.response?.data?.error) {
                message.error(error.response.data.error);
            } else if (error.message) {
                message.error(`Gagal mengupdate user: ${error.message}`);
            } else {
                message.error('Gagal mengupdate user');
            }
        } finally {
            setLoading(false);
        }
    };

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
            
            setSelectedFile(file);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
            
            message.success('Foto berhasil dipilih!');
            return false;
        },
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload Foto</div>
        </div>
    );

    const handleRemovePhoto = () => {
        setSelectedFile(null);
        setImagePreview('');
        message.info('Foto dihapus');
    };

    return (
        <div className="w-full">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
                preserve={false}
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
                        
                        {(selectedFile || imagePreview) && (
                            <div style={{ marginTop: 8 }}>
                                <Button 
                                    size="small" 
                                    danger 
                                    onClick={handleRemovePhoto}
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
                            disabled={loading}
                        >
                            Batal
                        </Button>
                        <Button 
                            type="primary" 
                            htmlType="submit"
                            loading={loading}
                            size="large"
                        >
                            {loading ? 'Mengupdate...' : 'Update User'}
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

export default EditUser;
