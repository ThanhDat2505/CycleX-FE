'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input, Button, ErrorMessage, Checkbox } from '@/app/components/ui';
import { authService } from '@/app/services/authService';

export function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Email validation
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Password validation
    const validatePassword = (password: string): boolean => {
        return password.length >= 6;
    };

    const handleSubmit = async () => {
        setError('');

        // Client-side validation
        if (!email || !password) {
            setError('Email và mật khẩu là bắt buộc');
            return;
        }

        if (!validateEmail(email)) {
            setError('Email không hợp lệ');
            return;
        }

        if (!validatePassword(password)) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setIsLoading(true);

        try {
            // TODO: Replace with actual API call when backend is ready
            // const response = await authService.login(email, password, rememberMe);
            // router.push('/home');

            // Temporary mock for testing
            await new Promise((resolve) => setTimeout(resolve, 1000));
            router.push('/home');
        } catch (err: any) {
            // Handle API errors
            if (err.status === 401) {
                setError('Email hoặc mật khẩu không đúng');
            } else if (err.status === 403) {
                setError('Tài khoản của bạn đã bị khóa');
            } else if (err.status === 404) {
                setError('Tài khoản không tồn tại');
            } else {
                setError('Đã có lỗi xảy ra. Vui lòng thử lại');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <ErrorMessage message={error} />

            <Input
                label="Email"
                id="email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="example@email.com"
            />

            <Input
                label="Mật khẩu"
                id="password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
            />

            <div className="flex items-center justify-between">
                <Checkbox
                    id="remember"
                    label="Ghi nhớ đăng nhập"
                    checked={rememberMe}
                    onChange={setRememberMe}
                />

                <Link
                    href="/forgot-password"
                    className="text-sm text-[#FF6B00] hover:underline font-medium"
                >
                    Quên mật khẩu?
                </Link>
            </div>

            <Button
                type="submit"
                loading={isLoading}
                onClick={handleSubmit}
            >
                Đăng nhập
            </Button>

            <div className="text-center mt-4 text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <Link
                    href="/register"
                    className="text-[#FF6B00] hover:underline font-semibold"
                >
                    Đăng ký ngay
                </Link>
            </div>
        </div>
    );
}