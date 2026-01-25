'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input, Button, ErrorMessage } from '@/app/components/ui';
import { authService } from '@/app/services/authService';
import { validateOtp } from '@/app/utils/validation';
import { handleAuthError } from '@/app/utils/errorHandler';

/**
 * VerifyEmailForm Component
 * BR-12: Email verification using OTP
 * BR-13: Resend OTP functionality
 * BR-14: Verify success → redirect to login
 */
export function VerifyEmailForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailFromUrl = searchParams.get('email') || '';

    // Form state
    const [email, setEmail] = useState(emailFromUrl);
    const [otp, setOtp] = useState('');

    // UI state
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    // Resend cooldown timer (BR-13)
    const [resendCooldown, setResendCooldown] = useState(0);

    // OTP expiration timer (BR-12)
    const [otpExpiration, setOtpExpiration] = useState(300); // 5 minutes default

    // Resend cooldown timer effect
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // OTP expiration timer effect
    useEffect(() => {
        if (otpExpiration > 0) {
            const timer = setTimeout(() => setOtpExpiration(otpExpiration - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [otpExpiration]);

    const handleVerify = async () => {
        setError('');
        setSuccess('');

        // Client-side validation
        if (!email) {
            setError('Email is required');
            return;
        }

        if (!otp) {
            setError('OTP code is required');
            return;
        }

        if (!validateOtp(otp)) {
            setError('OTP must be 6 digits');
            return;
        }

        // BR-12: Check if OTP expired
        if (otpExpiration <= 0) {
            setError('OTP has expired. Please request a new one.');
            return;
        }

        setIsLoading(true);

        try {
            // BR-12: Verify OTP
            const response = await authService.verifyOtp(email, otp);

            if (response.success) {
                setSuccess('Email verified successfully! Redirecting to login...');

                // BR-14: Redirect to login after successful verification
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (err: any) {
            // Handle specific error cases
            if (err.status === 400) {
                setError('Invalid or expired OTP. Please try again.');
            } else if (err.status === 404) {
                setError('Email not found. Please register first.');
            } else {
                setError(handleAuthError(err));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setSuccess('');

        if (!email) {
            setError('Email is required');
            return;
        }

        if (resendCooldown > 0) {
            setError(`Please wait ${resendCooldown} seconds before resending`);
            return;
        }

        setIsResending(true);

        try {
            // BR-13: Resend OTP
            const response = await authService.resendOtp(email);

            if (response.success) {
                setSuccess('OTP has been resent to your email');
                setResendCooldown(60); // 60 seconds cooldown
                setOtpExpiration(response.expiresIn || 300); // Reset expiration
                setOtp(''); // Clear old OTP input
            }
        } catch (err: any) {
            if (err.status === 404) {
                setError('Email not found. Please register first.');
            } else if (err.status === 429) {
                setError('Too many requests. Please try again later.');
            } else {
                setError(handleAuthError(err));
            }
        } finally {
            setIsResending(false);
        }
    };

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-4">
            <ErrorMessage message={error} />

            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">{success}</p>
                </div>
            )}

            {/* Email Input */}
            <Input
                label="Email"
                id="email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="your@email.com"
                disabled={isLoading || !!emailFromUrl}
            />

            {/* OTP Input */}
            <div>
                <Input
                    label="OTP Code"
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={setOtp}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    disabled={isLoading}
                />
                {otpExpiration > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                        OTP expires in: <span className="font-semibold">{formatTime(otpExpiration)}</span>
                    </p>
                )}
                {otpExpiration <= 0 && (
                    <p className="text-xs text-red-600 mt-1">
                        OTP has expired. Please request a new one.
                    </p>
                )}
            </div>

            {/* Verify Button */}
            <Button
                type="submit"
                loading={isLoading}
                onClick={handleVerify}
                disabled={otpExpiration <= 0}
            >
                Verify Email
            </Button>

            {/* Resend OTP */}
            <div className="text-center">
                <p className="text-sm text-gray-600">
                    Didn't receive the code?{' '}
                    <button
                        onClick={handleResend}
                        disabled={resendCooldown > 0 || isResending}
                        className={`font-semibold ${resendCooldown > 0 || isResending
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-brand-primary hover:underline'
                            }`}
                    >
                        {isResending ? 'Sending...' : resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend OTP'}
                    </button>
                </p>
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                    <strong>Note:</strong> Check your email inbox (and spam folder) for the 6-digit OTP code.
                    You must verify your email before you can log in.
                </p>
            </div>
        </div>
    );
}
