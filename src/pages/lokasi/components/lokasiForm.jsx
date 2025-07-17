import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import LokasiService from '../../../service/lokasiService';

const LokasiForm = ({ visible, onCancel, onSuccess, editData = null }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const isEdit = !!editData;

  useEffect(() => {
    if (visible) {
      if (isEdit) {
        form.setFieldsValue({
          lokasi_klaim: editData.lokasi_klaim
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
        await LokasiService.updateLokasi(editData.id_lokasi_klaim, values);
        message.success('Lokasi berhasil diperbarui');
      } else {
        await LokasiService.createLokasi(values);
        message.success('Lokasi berhasil ditambahkan');
      }
      
      form.resetFields();
      onSuccess();
      onCancel();
    } catch (error) {
      message.error(isEdit ? 'Gagal memperbarui lokasi' : 'Gagal menambahkan lokasi');
      console.error('Error submitting lokasi:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Edit Lokasi' : 'Tambah Lokasi Baru'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 20 }}
      >
        <Form.Item
          label="Nama Lokasi"
          name="lokasi_klaim"
          rules={[
            { required: true, message: 'Nama lokasi wajib diisi!' },
            { min: 3, message: 'Nama lokasi minimal 3 karakter!' },
            { max: 100, message: 'Nama lokasi maksimal 100 karakter!' }
          ]}
        >
          <Input 
            placeholder="Masukkan nama lokasi (contoh: Gedung A, Lantai 2, dll)"
            size="large"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button 
            onClick={onCancel} 
            style={{ marginRight: 8 }}
          >
            Batal
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
          >
            {isEdit ? 'Perbarui' : 'Simpan'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LokasiForm;
