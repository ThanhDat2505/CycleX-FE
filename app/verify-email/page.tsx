import Link from 'next/link';
import { AuthCard } from '@/app/components/layout';
import { Button } from '@/app/components/ui';

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#1A2332]">
            <AuthCard title="Verify Your Email">
                <div className="space-y-6 text-center">
                    {/* Success Icon */}
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Check Your Email
                        </h2>
                        <p className="text-gray-600 text-sm">
                            We've sent a verification link to your email address.
                            Please check your inbox and click the link to verify your account.
                        </p>
                    </div>

                    {/* Note */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> You must verify your email before you can log in.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link href="/login">
                            <Button variant="primary">
                                Go to Login
                            </Button>
                        </Link>

                        <p className="text-sm text-gray-600">
                            Didn't receive the email?{' '}
                            <button className="text-[#FF6B00] hover:underline font-semibold">
                                Resend
                            </button>
                        </p>
                    </div>
                </div>
            </AuthCard>
        </div>
    );
}
