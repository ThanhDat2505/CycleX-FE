'use client'; //Báo cho Next.js biết: "File này chạy ở phía client (browser), không phải server"
// bởi vì dùng useState (chỉ chạy được ở browser)
import { useState } from 'react'; // giống như biến, nhưng khi thay đổi, react sẽ tự động render lại
import { useRouter, useSearchParams } from 'next/navigation'; // hook của nextjs để điều hướng 
import Link from 'next/link'; // component để tạo link thay cho a
import { Input, Button, ErrorMessage, Checkbox } from '@/app/components/ui';
import { authService } from '@/app/services/authService';
import { validateEmail, validatePasswordLogin } from '@/app/utils/validation';
import { handleAuthError } from '@/app/utils/errorHandler';

export function LoginForm() {
    // mục đích là lưu email, password, rememberMe, error, isLoading
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl') || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    // Validation functions moved to utils/validation.ts

    // Handel submit
    const handleSubmit = async () => {
        // xóa thông báo lỗi cũ (nếu có)
        setError('');

        // Client-side validation
        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        if (!validateEmail(email)) {
            setError('Email is invalid');
            return;
        }

        if (!validatePasswordLogin(password)) {
            setError('Password must be at least 6 characters long');
            return;
        }

        // nếu không phải return có nghĩa là thỏa điều kiện, để được gửi đi
        // button sẽ hiện 'đang xử lí' và disabled
        setIsLoading(true);

        try {
            const response = await authService.login(email, password, rememberMe);

            // BR-L07: Check isVerify first
            if (!response.user.isVerify) {
                // Redirect FIRST before setting state to avoid timing issues
                router.push(`/verify-email?email=${encodeURIComponent(email)}`);
                setError('Please verify your email first');
                setIsLoading(false);
                return;
            }

            // BR-L05, BR-L06: Check status
            switch (response.user.status) {
                case 'INACTIVE':
                    // BR-L05: INACTIVE → redirect verify email
                    // Redirect FIRST before setting state to avoid timing issues
                    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
                    setError('Account inactive. Please verify your email');
                    setIsLoading(false);
                    return;

                case 'SUSPENDED':
                    // BR-L05: SUSPENDED → show error, contact admin
                    setError('Your account has been suspended. Please contact Admin for assistance.');
                    setIsLoading(false);
                    return;

                case 'ACTIVE':
                    // BR-L05: ACTIVE → allow login
                    break;

                default:
                    // Unknown status
                    setError('Invalid account status. Please contact support.');
                    setIsLoading(false);
                    return;
            }

            // BR-L03: Login successful - token already saved by authService
            // BR-L08: Redirect to returnUrl (or Home if not specified)
            // ✅ Force reload to update Header UI
            window.location.href = returnUrl;
        } catch (err: any) {
            // BR-L11: Use centralized error handler
            setError(handleAuthError(err));
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
                label="Password"
                id="password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
            />

            <div className="flex items-center justify-between">
                <Checkbox
                    id="remember"
                    label="Remember me"
                    checked={rememberMe}
                    onChange={setRememberMe}
                />

                <Link
                    href="/forgot-password"
                    className="text-sm text-brand-primary hover:underline font-medium"
                >
                    Forgot password?
                </Link>
            </div>

            <Button
                type="submit"
                loading={isLoading}
                onClick={handleSubmit}
            >
                Login
            </Button>

            <div className="text-center mt-4 text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                    href="/register"
                    className="text-brand-primary hover:underline font-semibold"
                >
                    Register now
                </Link>
            </div>
        </div>
    );
}