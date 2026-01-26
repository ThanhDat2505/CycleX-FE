'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input, Button, ErrorMessage } from '@/app/components/ui';
import { authService } from '@/app/services/authService';
import {
    validateEmail,
    validatePasswordRegister,
    validateCccd,
    validatePhone
} from '@/app/utils/validation';
import { handleAuthError } from '@/app/utils/errorHandler';

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

    // Validation functions moved to utils/validation.ts

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

        if (!validatePasswordRegister(password)) {
            setError('Password must be 6-20 characters long');
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
            // BR-02: Call register API
            const response = await authService.register(email, password, cccd, phone);

            // BR-10, BR-17: Redirect to verify email screen with email parameter
            router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        } catch (err: any) {
            // Handle specific error cases
            if (err.status === 409) { // Conflict - duplicate data
                if (err.message.toLowerCase().includes('email')) {
                    setError('Email already exists. Please use another email or login.');
                } else if (err.message.toLowerCase().includes('phone')) {
                    setError('Phone number already exists. Please use another number.');
                } else {
                    setError('This information already exists in the system.');
                }
            } else {
                // Use centralized error handler for other errors
                setError(handleAuthError(err));
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
                disabled={isLoading}
            />

            <Input
                label="Password"
                id="password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="8-20 characters"
                disabled={isLoading}
            />

            <Input
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Re-enter password"
                disabled={isLoading}
            />

            <Input
                label="CCCD"
                id="cccd"
                type="text"
                value={cccd}
                onChange={setCccd}
                placeholder="12 digits"
                disabled={isLoading}
            />

            <Input
                label="Phone (Optional)"
                id="phone"
                type="text"
                value={phone}
                onChange={setPhone}
                placeholder="0123456789"
                disabled={isLoading}
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
                    className="text-brand-primary hover:underline font-semibold"
                >
                    Login now
                </Link>
            </div>
        </div>
    );
}
