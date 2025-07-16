import api from './authService';

const PencocokanService = {
    getAllCocok: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const endpoint = queryParams ? `/cocok?${queryParams}` : '/cocok';
            const response = await api.makeRequest(endpoint, {
                method: 'GET',
            });
            return response;
        } catch (error) {
            console.error('Error fetching cocok:', error);
            throw error;
        }
    },

    getCocokById: async (id_laporan_cocok) => {
        try {
            const response = await api.makeRequest(`/cocok/${id_laporan_cocok}`, {
                method: 'GET',
            });
            return response;
        } catch (error) {
            console.error('Error fetching cocok by id:', error);
            throw error;
        }
    },

    createCocok: async (data) => {
        try {
            const response = await api.makeRequest('/cocok', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            return response;
        } catch (error) {
            console.error('Error creating cocok:', error);
            throw error;
        }
    },

    updateCocok: async (id_laporan_cocok, data) => {
        try {
            const response = await api.makeRequest(`/cocok/${id_laporan_cocok}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            return response;
        } catch (error) {
            console.error('Error updating cocok:', error);
            throw error;
        }
    },

    deleteCocok: async (id_laporan_cocok) => {
        try {
            const response = await api.makeRequest(`/cocok/${id_laporan_cocok}`, {
                method: 'DELETE',
            });
            return response;
        } catch (error) {
            console.error('Error deleting cocok:', error);
            throw error;
        }
    }
};

export default PencocokanService;
