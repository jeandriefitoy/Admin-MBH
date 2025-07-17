import api from './authService';

const KlaimService = {
    getAllKlaim: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const endpoint = queryParams ? `/klaim?${queryParams}` : '/klaim';            
            const response = await api.makeRequest(endpoint, {
                method: 'GET',
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    getKlaimById: async (id) => {
        try {
            const response = await api.makeRequest(`/klaim/${id}`, {
                method: 'GET',
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    createKlaim: async (data) => {
        try {
            if (data instanceof FormData) {
                return await api.makeRequest('/klaim', {
                    method: 'POST',
                    body: data,
                });
            }
            return await api.makeRequest('/klaim', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        } catch (error) {
            console.error('Error creating klaim:', error);
            throw error;
        }
    },

    updateKlaim: async (id, data) => {
        try {
            if (data instanceof FormData) {
                return await api.makeRequest(`/klaim/${id}`, {
                    method: 'PUT',
                    body: data,
                });
            }
            return await api.makeRequest(`/klaim/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        } catch (error) {
            console.error('Error updating klaim:', error);
            throw error;
        }
    },

    deleteKlaim: async (id) => {
        try {
            const response = await api.makeRequest(`/klaim/${id}`, {
                method: 'DELETE',
            });
            return response;
        } catch (error) {
            console.error('Error deleting klaim:', error);
            throw error;
        }
    }
};

export default KlaimService;
