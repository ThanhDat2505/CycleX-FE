// app/login/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        if (!password) {
            setError('Password is required');
            return;
        }


        setIsLoading(true);

        try {
            // TODO: Replace with actual API call when backend is ready
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Store token for session management
            // mock API response only
            // DO NOT store token
            // Redirect to Home (as per business rule)
            router.push('/home');
            // chỗ này cần sửa lại theo role
            // switch (role) {
            //   case 'BUYER': router.push('/home'); break;
            //   case 'SELLER': router.push('/seller/dashboard'); break;
            //   ...
            // }
        } catch (err) {
            setError('Email hoặc mật khẩu không đúng.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-orange-50">
            <div className="w-full max-w-md">
                {/* CycleX Branding */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mb-2">
                        CycleX
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Nền tảng mua bán xe đạp thể thao
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Đăng nhập
                    </h2>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email"
                                autoComplete="email"
                                required
                                disabled={isLoading}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu"
                                autoComplete="current-password"
                                required
                                disabled={isLoading}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:from-green-700 hover:to-green-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>

                        {/* Forgot Password */}
                        <div className="text-center">
                            <a
                                href="/forgot-password"
                                className="text-sm text-green-600 hover:text-green-700 hover:underline transition-colors"
                            >
                                Quên mật khẩu?
                            </a>
                        </div>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">hoặc</span>
                            </div>
                        </div>

                        {/* Register Link */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Chưa có tài khoản?{' '}
                                <a
                                    href="/register"
                                    className="font-semibold text-green-600 hover:text-green-700 hover:underline transition-colors"
                                >
                                    Đăng ký ngay
                                </a>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-gray-500">
                    <p>© 2026 CycleX. Nền tảng mua bán xe đạp thể thao.</p>
                </div>
            </div>
        </div>
    );
}
