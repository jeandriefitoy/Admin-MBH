import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import authService from '../../service/api';

export default function LoginPage({ onLogin }) {
    const [formData, setFormData] = useState({
        email: 'admin@uad.ac.id',
        password: 'password123'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            console.log('Attempting login with:', formData);
            const response = await authService.login(formData.email, formData.password);
            
            console.log('Login response:', response);
            if (response.message === "Login berhasil" && response.token && response.user) {
                const userData = {
                    id: response.user.id,
                    email: response.user.email,
                    username: response.user.username,
                    name: response.user.username || response.user.email,
                    role: response.user.role,
                    token: response.token
                };

                console.log('Processed user data:', userData);
                onLogin(userData);
            } else {
                throw new Error('Response tidak sesuai format yang diharapkan');
            }

        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Login gagal. Periksa email dan password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e1a78] to-[#0f172a] no-scroll px-4">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#1e1a78] to-[#0f172a] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Panel</h1>
                    <p className="text-gray-600">Manajemen Barang Hilang</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e1a78] focus:border-transparent transition-colors"
                                placeholder="Masukkan email"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e1a78] focus:border-transparent transition-colors"
                                placeholder="Masukkan password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-[#1e1a78] to-[#0f172a] text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#1e1a78] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Masuk...
                            </div>
                        ) : (
                            'Masuk'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
