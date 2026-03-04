'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input, Button, ErrorMessage, Checkbox } from '@/app/components/ui';
import { authService } from '@/app/services/authService';
import { validateEmail, validatePasswordLogin } from '@/app/utils/validation';
import { handleAuthError } from '@/app/utils/errorHandler';

/** Style constants */
const STYLES = {
    form: 'space-y-6',
    inputWrapper: 'space-y-5 animate-fade-in delay-100',
    rememberRow: 'flex items-center justify-between animate-fade-in delay-200',
    forgotLink: 'text-sm text-brand-primary hover:text-brand-primary/80 transition-colors font-semibold',
    registerRow: 'text-center mt-6 text-sm text-gray-500 animate-fade-in delay-300',
    registerLink: 'text-brand-primary hover:underline font-bold ml-1',
} as const;

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl') || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = useCallback(async () => {
        setError('');

        if (!email || !password) {
            setError('Vui lòng nhập email và mật khẩu');
            return;
        }

        if (!validateEmail(email)) {
            setError('Email không hợp lệ');
            return;
        }

        if (!validatePasswordLogin(password)) {
            setError('Mật khẩu phải từ 6 ký tự');
            return;
        }

        setIsLoading(true);

        try {
            const response = await authService.login(email, password, rememberMe);

            // BR-L07: Check isVerify first
            if (!response.user.isVerify) {
                router.push(`/verify-email?email=${encodeURIComponent(email)}`);
                setError('Vui lòng xác minh email trước');
                setIsLoading(false);
                return;
            }

            // BR-L05, BR-L06: Check status
            switch (response.user.status) {
                case 'INACTIVE':
                    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
                    setError('Tài khoản chưa kích hoạt. Vui lòng xác minh email');
                    setIsLoading(false);
                    return;

                case 'SUSPENDED':
                    setError('Tài khoản bị khóa. Vui lòng liên hệ Admin.');
                    setIsLoading(false);
                    return;

                case 'ACTIVE':
                    break;

                default:
                    setError('Trạng thái tài khoản không hợp lệ.');
                    setIsLoading(false);
                    return;
            }

            if (response.user.role === 'SHIPPER') {
                router.push('/shipper');
            } else {
                router.push(returnUrl);
            }
        } catch (err: any) {
            setError(handleAuthError(err));
        } finally {
            setIsLoading(false);
        }
    }, [email, password, rememberMe, returnUrl, router]);

    return (
        <div className={STYLES.form}>
            <ErrorMessage message={error} />

            <div className={STYLES.inputWrapper}>
                <Input
                    label="Email"
                    id="email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="email@example.com"
                    disabled={isLoading}
                />

                <Input
                    label="Mật khẩu"
                    id="password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="••••••••"
                    disabled={isLoading}
                />
            </div>

            <div className={STYLES.rememberRow}>
                <Checkbox
                    id="remember"
                    label="Ghi nhớ đăng nhập"
                    checked={rememberMe}
                    onChange={setRememberMe}
                />

                <Link href="/forgot-password" className={STYLES.forgotLink}>
                    Quên mật khẩu?
                </Link>
            </div>

            <Button
                type="submit"
                loading={isLoading}
                onClick={handleSubmit}
                className="w-full py-4 text-lg font-bold shadow-xl shadow-brand-primary/10"
            >
                Đăng Nhập
            </Button>

            <div className={STYLES.registerRow}>
                Chưa có tài khoản?
                <Link href="/register" className={STYLES.registerLink}>
                    Đăng ký ngay
                </Link>
            </div>
        </div>
    );
}