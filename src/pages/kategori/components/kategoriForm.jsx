import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import KategoriService from '../../../service/kategoriService';

const KategoriForm = ({ visible, onCancel, onSuccess, editData = null }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const isEdit = !!editData;

  useEffect(() => {
    if (visible) {
      if (isEdit) {
        form.setFieldsValue({
          nama_kategori: editData.nama_kategori
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, editData, isEdit, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isEdit) {
        await KategoriService.updateKategori(editData.id_kategori, values);
        message.success('Kategori berhasil diperbarui');
      } else {
        await KategoriService.createKategori(values);
        message.success('Kategori berhasil ditambahkan');
      }
      
      form.resetFields();
      onSuccess();
      onCancel();
    } catch (error) {
      message.error(
        isEdit 
          ? 'Gagal memperbarui kategori: ' + (error.message || 'Terjadi kesalahan')
          : 'Gagal menambahkan kategori: ' + (error.message || 'Terjadi kesalahan')
      );
      console.error('Error submitting kategori:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Edit Kategori' : 'Tambah Kategori Baru'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={600}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 20 }}
      >
        <Form.Item
          label="Nama Kategori"
          name="nama_kategori"
          rules={[
            { required: true, message: 'Nama kategori wajib diisi!' },
            { min: 2, message: 'Nama kategori minimal 2 karakter!' },
            { max: 50, message: 'Nama kategori maksimal 50 karakter!' },
            { 
              pattern: /^[a-zA-Z0-9\s\-]+$/, 
              message: 'Nama kategori hanya boleh mengandung huruf, angka, spasi, dan tanda hubung!' 
            }
          ]}
        >
          <Input 
            placeholder="Contoh: Elektronik, Dokumen, Aksesoris, dll"
            size="large"
            maxLength={50}
            showCount
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: 24 }}>
          <Button 
            onClick={onCancel} 
            style={{ marginRight: 12 }}
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
            {isEdit ? 'Perbarui Kategori' : 'Simpan Kategori'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default KategoriForm;
