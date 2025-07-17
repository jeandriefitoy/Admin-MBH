import api from './authService';

const LaporanService = {
    getAllLaporan: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const endpoint = queryParams ? `/laporan?${queryParams}` : '/laporan';            
            const response = await api.makeRequest(endpoint, {
                method: 'GET',
            });
            return response;
        } catch (error) {
            console.error('Error fetching laporan:', error);
            throw error;
        }
    },

    getLaporanById: async (id) => {
        try {
            const response = await api.makeRequest(`/laporan/${id}`, {
                method: 'GET',
            });
            return response;
        } catch (error) {
            console.error('Error fetching laporan by id:', error);
            throw error;
        }
    },

    createLaporan: async (data) => {
        try {
            if (data instanceof FormData) {
                return await api.makeRequest('/laporan', {
                    method: 'POST',
                    body: data,
                });
            }
            return await api.makeRequest('/laporan', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        } catch (error) {
            console.error('Error creating laporan:', error);
            throw error;
        }
    },

    updateLaporan: async (id, data) => {
        try {
            if (data instanceof FormData) {
                return await api.makeRequest(`/laporan/${id}`, {
                    method: 'PUT',
                    body: data,
                });
            }
            return await api.makeRequest(`/laporan/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        } catch (error) {
            console.error('Error updating laporan:', error);
            throw error;
        }
    },

    deleteLaporan: async (id) => {
        try {
            const response = await api.makeRequest(`/laporan/${id}`, {
                method: 'DELETE',
            });
            return response;
        } catch (error) {
            console.error('Error deleting laporan:', error);
            throw error;
        }
    },

    uploadFoto: async (files) => {
        try {
            const formData = new FormData();
            if (Array.isArray(files)) {
                files.forEach((file, index) => {
                    formData.append(`foto_${index}`, file);
                });
            } else {
                formData.append('foto', files);
            }
            
            const response = await api.makeRequest('/laporan/upload-foto', {
                method: 'POST',
                body: formData,
            });
            
            return response;
        } catch (error) {
            console.error('Error uploading foto:', error);
            throw error;
        }
    }
};

export default LaporanService;
