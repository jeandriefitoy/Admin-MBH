import api from './authService';

const KategoriService = {
    getAllKategori: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const endpoint = queryParams ? `/kategori?${queryParams}` : '/kategori';
            
            console.log('Calling endpoint:', endpoint);
            
            const response = await api.makeRequest(endpoint, {
                method: 'GET',
            });
            
            console.log('KategoriService response:', response);
            return response;
        } catch (error) {
            console.error('Error fetching kategori:', error);
            throw error;
        }
    },

    getKategoriById: async (id) => {
        try {
            const response = await api.makeRequest(`/kategori/${id}`, {
                method: 'GET',
            });
            return response;
        } catch (error) {
            console.error('Error fetching kategori by id:', error);
            throw error;
        }
    },

    createKategori: async (data) => {
        try {
            const response = await api.makeRequest('/kategori', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            return response;
        } catch (error) {
            console.error('Error creating kategori:', error);
            throw error;
        }
    },

    updateKategori: async (id, data) => {
        try {
            const response = await api.makeRequest(`/kategori/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            return response;
        } catch (error) {
            console.error('Error updating kategori:', error);
            throw error;
        }
    },

    deleteKategori: async (id) => {
        try {
            const response = await api.makeRequest(`/kategori/${id}`, {
                method: 'DELETE',
            });
            return response;
        } catch (error) {
            console.error('Error deleting kategori:', error);
            throw error;
        }
    }
};

export default KategoriService;
