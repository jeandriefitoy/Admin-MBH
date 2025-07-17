import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Upload, Button, message, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import LaporanService from '../../../service/laporanService';
import LokasiService from '../../../service/lokasiService';
import KategoriService from '../../../service/kategoriService';

const { TextArea } = Input;
const { Option } = Select;

const LaporanForm = ({
    visible,
    onCancel,
    onSuccess,
    editData = null,
    mode = 'create'
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [kategoriList, setKategoriList] = useState([]);
    const [lokasiList, setLokasiList] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(false);

    useEffect(() => {
        if (visible) {
            fetchOptions();
            if (mode === 'edit' && editData) {
                form.setFieldsValue({
                    id_kategori: editData._original?.id_kategori || editData.id_kategori,
                    id_lokasi_klaim: editData._original?.id_lokasi_klaim || editData.id_lokasi_klaim,
                    lokasi_kejadian: editData._original?.lokasi_kejadian || editData.lokasi_kejadian,
                    nama_barang: editData._original?.nama_barang || editData.nama_barang,
                    jenis_laporan: editData._original?.jenis_laporan || editData.jenis_laporan,
                    deskripsi: editData._original?.deskripsi || editData.deskripsi,
                    status: editData._original?.status || editData.status
                });

                const photoData = editData._original?.url_foto || editData.foto || editData.foto;
                if (photoData && Array.isArray(photoData)) {
                    const existingFiles = photoData.map((url, index) => ({
                        uid: `existing-${index}`,
                        name: `foto-${index + 1}.jpg`,
                        status: 'done',
                        url: url,
                        isExisting: true
                    }));
                    setFileList(existingFiles);
                }
            }
        } else {
            form.resetFields();
            setFileList([]);
        }
    }, [visible, mode, editData, form]);


    const fetchOptions = async () => {
        setLoadingOptions(true);
        try {
            const [kategoriResponse, lokasiResponse] = await Promise.all([
                KategoriService.getAllKategori(),
                LokasiService.getAllLokasi()
            ]);
            let kategoriData = [];
            if (Array.isArray(kategoriResponse)) {
                kategoriData = kategoriResponse;
            } else if (kategoriResponse && Array.isArray(kategoriResponse.data)) {
                kategoriData = kategoriResponse.data;
            }

            let lokasiData = [];
            if (Array.isArray(lokasiResponse)) {
                lokasiData = lokasiResponse;
            } else if (lokasiResponse && Array.isArray(lokasiResponse.data)) {
                lokasiData = lokasiResponse.data;
            }

            setKategoriList(kategoriData);
            setLokasiList(lokasiData);
        } catch (error) {
            message.error('Gagal memuat data kategori dan lokasi');
        } finally {
            setLoadingOptions(false);
        }
    };


    const handleSubmit = async (values) => {
        setLoading(true);

        try {
            const formData = new FormData();
            Object.keys(values).forEach(key => {
                if (values[key]) {
                    formData.append(key, values[key]);
                    console.log(`Added ${key}:`, values[key]);
                }
            });

            const newFiles = fileList.filter(file => !file.isExisting && file.originFileObj);

            if (newFiles.length > 0) {
                newFiles.forEach((file, index) => {
                    const fileToUpload = file.originFileObj;
                    if (fileToUpload) {
                        formData.append('foto', fileToUpload, fileToUpload.name);
                    }
                });
            }
            for (let pair of formData.entries()) {
                if (pair[1] instanceof File) {
                    console.log(`${pair[0]}: File(${pair[1].name}, ${pair[1].type}, ${pair[1].size} bytes)`);
                } else {
                    console.log(`${pair[0]}: ${pair[1]}`);
                }
            }

            let response;
            if (mode === 'create') {
                response = await LaporanService.createLaporan(formData);
                message.success('Laporan berhasil dibuat');
            } else {
                const laporanId = editData._original?.id_laporan || editData.id_laporan;
                response = await LaporanService.updateLaporan(laporanId, formData);
                message.success('Laporan berhasil diupdate');
            }

            onSuccess(response);
            onCancel();

        } catch (error) {
            message.error(`Gagal ${mode === 'create' ? 'membuat' : 'mengupdate'} laporan: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };


    const handleUploadChange = ({ fileList: newFileList }) => {
        if (newFileList.length > 3) {
            message.warning('Maksimal 3 foto yang dapat diupload');
            return;
        }
        setFileList(newFileList);
    };

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Hanya file gambar yang diperbolehkan!');
            return false;
        }

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Ukuran file harus kurang dari 5MB!');
            return false;
        }

        return false;
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload Foto</div>
        </div>
    );

    return (
        <Modal
            title={mode === 'create' ? 'Tambah Laporan' : 'Edit Laporan'}
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                disabled={loading || loadingOptions}
            >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Form.Item
                        name="id_kategori"
                        label="Kategori"
                        rules={[{ required: true, message: 'Pilih kategori!' }]}
                    >
                        <Select
                            placeholder="Pilih kategori"
                            loading={loadingOptions}
                            showSearch
                            optionFilterProp="children"
                        >
                            {kategoriList.map(kategori => (
                                <Option key={kategori.id_kategori} value={kategori.id_kategori}>
                                    {kategori.nama_kategori}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="id_lokasi_klaim"
                        label="Lokasi Klaim"
                        rules={[{ required: true, message: 'Pilih lokasi klaim!' }]}
                    >
                        <Select
                            placeholder="Pilih lokasi klaim"
                            loading={loadingOptions}
                            showSearch
                            optionFilterProp="children"
                        >
                            {lokasiList.map(lokasi => (
                                <Option key={lokasi.id_lokasi_klaim} value={lokasi.id_lokasi_klaim}>
                                    {lokasi.lokasi_klaim}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Form.Item
                        name="nama_barang"
                        label="Nama Barang"
                        rules={[{ required: true, message: 'Masukkan nama barang!' }]}
                    >
                        <Input placeholder="Contoh: Laptop Asus" />
                    </Form.Item>

                    <Form.Item
                        name="jenis_laporan"
                        label="Jenis Laporan"
                        rules={[{ required: true, message: 'Pilih jenis laporan!' }]}
                    >
                        <Select placeholder="Pilih jenis laporan">
                            <Option value="hilang">Hilang</Option>
                            <Option value="temuan">Temuan</Option>
                        </Select>
                    </Form.Item>
                </div>

                <Form.Item
                    name="lokasi_kejadian"
                    label="Lokasi Kejadian"
                    rules={[{ required: true, message: 'Masukkan lokasi kejadian!' }]}
                >
                    <Input placeholder="Contoh: Lantai 2 dekat tangga" />
                </Form.Item>

                {mode === 'edit' && (
                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: 'Pilih status!' }]}
                    >
                        <Select placeholder="Pilih status">
                            <Option value="proses">Proses</Option>
                            <Option value="cocok">Cocok</Option>
                            <Option value="selesai">Selesai</Option>
                        </Select>
                    </Form.Item>
                )}

                <Form.Item
                    name="deskripsi"
                    label="Deskripsi"
                    rules={[{ required: true, message: 'Masukkan deskripsi!' }]}
                >
                    <TextArea
                        rows={4}
                        placeholder="Deskripsikan barang secara detail..."
                    />
                </Form.Item>

                <Form.Item label="Foto Barang (Maksimal 3)">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleUploadChange}
                        beforeUpload={beforeUpload}
                        multiple
                        accept="image/*"
                        name="foto" 
                    >
                        {fileList.length >= 3 ? null : uploadButton}
                    </Upload>
                    <div style={{ color: '#666', fontSize: '12px', marginTop: 8 }}>
                        Format: JPG, PNG, GIF. Maksimal 5MB per file.
                    </div>
                </Form.Item>


                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Space>
                        <Button onClick={onCancel}>
                            Batal
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            {mode === 'create' ? 'Buat Laporan' : 'Update Laporan'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default LaporanForm;
