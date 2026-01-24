'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import { ErrorMessage } from '@/app/components/ui/ErrorMessage';

export function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setError('');

        // Client-side validation
        if (!email || !password) {
            setError('Email và mật khẩu là bắt buộc');
            return;
        }

        setIsLoading(true);

        // TODO: Replace with actual API call when backend is ready
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push('/home');

        setIsLoading(false);
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

            <Button
                type="submit"
                loading={isLoading}
                onClick={handleSubmit}
            >
                Đăng nhập
            </Button>
        </div>
    );
}