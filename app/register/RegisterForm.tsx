'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input, Button, ErrorMessage } from '@/app/components/ui';
import { authService } from '@/app/services/authService';

export function RegisterForm() {
    const router = useRouter();

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [cccd, setCccd] = useState('');
    const [phone, setPhone] = useState('');

    // UI state
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Email validation
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Password validation (8-20 characters)
    const validatePassword = (password: string): boolean => {
        return password.length >= 8 && password.length <= 20;
    };

    // CCCD validation (12 digits)
    const validateCccd = (cccd: string): boolean => {
        const cccdRegex = /^\d{12}$/;
        return cccdRegex.test(cccd);
    };

    // Phone validation (10 digits, starts with 0)
    const validatePhone = (phone: string): boolean => {
        if (!phone) return true; // Optional field
        const phoneRegex = /^0\d{9}$/;
        return phoneRegex.test(phone);
    };

    const handleSubmit = async () => {
        setError('');

        // Client-side validation
        if (!email || !password || !confirmPassword || !cccd) {
            setError('Please fill in all required fields');
            return;
        }

        if (!validateEmail(email)) {
            setError('Email is invalid');
            return;
        }

        if (!validatePassword(password)) {
            setError('Password must be 8-20 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!validateCccd(cccd)) {
            setError('CCCD must be 12 digits');
            return;
        }

        if (phone && !validatePhone(phone)) {
            setError('Phone number is invalid (must be 10 digits starting with 0)');
            return;
        }

        setIsLoading(true);

        try {
            // TODO: Replace with actual API call when backend is ready
            // const response = await authService.register(email, password, cccd, phone);
            // router.push('/verify-email');

            // Temporary mock for testing
            await new Promise((resolve) => setTimeout(resolve, 1000));
            router.push('/verify-email');
        } catch (err: any) {
            // Handle API errors
            if (err.status === 400) {
                setError(err.message || 'Email already exists');
            } else if (err.errors?.email) {
                setError(err.errors.email[0]);
            } else {
                setError('An error occurred. Please try again.');
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
                label="Password"
                id="password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="8-20 characters"
            />

            <Input
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Re-enter password"
            />

            <Input
                label="CCCD"
                id="cccd"
                type="text"
                value={cccd}
                onChange={setCccd}
                placeholder="12 digits"
            />

            <Input
                label="Phone (Optional)"
                id="phone"
                type="text"
                value={phone}
                onChange={setPhone}
                placeholder="0123456789"
            />

            <Button
                type="submit"
                loading={isLoading}
                onClick={handleSubmit}
            >
                Register
            </Button>

            <div className="text-center mt-4 text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                    href="/login"
                    className="text-[#FF6B00] hover:underline font-semibold"
                >
                    Login now
                </Link>
            </div>
        </div>
    );
}

export default RegisterForm;
