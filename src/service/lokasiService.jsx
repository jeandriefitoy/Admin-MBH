import api from './authService';

const LokasiService = {
    getAllLokasi: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const endpoint = queryParams ? `/lokasi?${queryParams}` : '/lokasi';
            const response = await api.makeRequest(endpoint, {
                method: 'GET',
            });
            return response;
        } catch (error) {
            console.error('Error fetching lokasi:', error);
            throw error;
        }
    },

    getLokasiById: async (id_lokasi_klaim) => {
        try {
            const response = await api.makeRequest(`/lokasi/${id_lokasi_klaim}`, {
                method: 'GET',
            });
            return response;
        } catch (error) {
            console.error('Error fetching lokasi by id:', error);
            throw error;
        }
    },

    createLokasi: async (data) => {
        try {
            const response = await api.makeRequest('/lokasi', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            return response;
        } catch (error) {
            console.error('Error creating lokasi:', error);
            throw error;
        }
    },

    updateLokasi: async (id_lokasi_klaim, data) => {
        try {
            const response = await api.makeRequest(`/lokasi/${id_lokasi_klaim}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            return response;
        } catch (error) {
            console.error('Error updating lokasi:', error);
            throw error;
        }
    },

    deleteLokasi: async (id_lokasi_klaim) => {
        try {
            const response = await api.makeRequest(`/lokasi/${id_lokasi_klaim}`, {
                method: 'DELETE',
            });
            return response;
        } catch (error) {
            console.error('Error deleting lokasi:', error);
            throw error;
        }
    }
};

export default LokasiService;
