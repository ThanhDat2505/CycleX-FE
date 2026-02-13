'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input, Button, ErrorMessage, RadioGroup } from '@/app/components/ui';
import { authService } from '@/app/services/authService';
import {
    validateEmail,
    validatePasswordRegister,
    validateCccd,
    validatePhone
} from '@/app/utils/validation';
import { handleAuthError } from '@/app/utils/errorHandler';

/** Style constants */
const STYLES = {
    form: 'space-y-6',
    inputGrid: 'grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in delay-100',
    fullWidth: 'md:col-span-2',
    loginRow: 'text-center mt-6 text-sm text-gray-500 animate-fade-in delay-300',
    loginLink: 'text-brand-primary hover:underline font-bold ml-1',
} as const;

export function RegisterForm() {
    const router = useRouter();

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [cccd, setCccd] = useState('');
    const [role, setRole] = useState<'BUYER' | 'SELLER'>('BUYER');

    // UI state
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = useCallback(async () => {
        setError('');

        if (!email || !password || !confirmPassword || !phone || !cccd) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (!validateEmail(email)) {
            setError('Email không hợp lệ');
            return;
        }

        if (!validatePasswordRegister(password)) {
            setError('Mật khẩu phải từ 6-20 ký tự');
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (!validatePhone(phone)) {
            setError('Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 0)');
            return;
        }

        if (!validateCccd(cccd)) {
            setError('CCCD phải đủ 12 chữ số');
            return;
        }

        setIsLoading(true);

        try {
            const response = await authService.register(email, password, phone, cccd, role);
            const sendOtpResponse = await authService.sendOtp(email);

            if (sendOtpResponse.message !== 'OTP sent successfully') {
                throw new Error('Không thể gửi mã OTP');
            }
            if (response.message !== 'Registration successful') {
                throw new Error('Đăng ký không thành công');
            }

            // Redirect with a slight delay to allow any success feedback if added later
            router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        } catch (err: any) {
            if (err.status === 409) {
                if (err.message.toLowerCase().includes('email')) {
                    setError('Email đã tồn tại trong hệ thống.');
                } else if (err.message.toLowerCase().includes('phone')) {
                    setError('Số điện thoại đã tồn tại.');
                } else {
                    setError('Thông tin đăng ký đã tồn tại.');
                }
            } else {
                setError(handleAuthError(err));
            }
        } finally {
            setIsLoading(false);
        }
    }, [email, password, confirmPassword, phone, cccd, role, router]);

    return (
        <div className={STYLES.form}>
            <ErrorMessage message={error} />

            <div className={STYLES.inputGrid}>
                <div className={STYLES.fullWidth}>
                    <Input
                        label="Email"
                        id="email"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="email@example.com"
                        disabled={isLoading}
                    />
                </div>

                <Input
                    label="Mật khẩu"
                    id="password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="6-20 ký tự"
                    disabled={isLoading}
                />

                <Input
                    label="Xác nhận mật khẩu"
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Nhập lại mật khẩu"
                    disabled={isLoading}
                />

                <Input
                    label="Số điện thoại"
                    id="phone"
                    type="text"
                    value={phone}
                    onChange={setPhone}
                    placeholder="0xxx xxx xxx"
                    disabled={isLoading}
                />

                <Input
                    label="Số CCCD"
                    id="cccd"
                    type="text"
                    value={cccd}
                    onChange={setCccd}
                    placeholder="12 chữ số"
                    disabled={isLoading}
                />

                <div className={STYLES.fullWidth}>
                    <RadioGroup
                        label="Tôi muốn:"
                        name="role"
                        options={[
                            { label: 'Mua xe', value: 'BUYER' },
                            { label: 'Bán xe', value: 'SELLER' }
                        ]}
                        selectedValue={role}
                        onChange={setRole}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <Button
                type="submit"
                loading={isLoading}
                onClick={handleSubmit}
                className="w-full py-4 text-lg font-bold shadow-xl shadow-brand-primary/10"
            >
                Đăng Ký Tài Khoản
            </Button>

            <div className={STYLES.loginRow}>
                Đã có tài khoản?
                <Link href="/login" className={STYLES.loginLink}>
                    Đăng nhập ngay
                </Link>
            </div>
        </div>
    );
}
