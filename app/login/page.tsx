// app/login/page.tsx
'use client';

import { useState, FormEvent } from 'react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        // ===== FE VALIDATION (ALLOWED) =====
        if (!username.trim()) {
            setError('Username is required');
            return;
        }

        if (!password) {
            setError('Password is required');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setIsLoading(true);

        try {
            // ====================================================
            // TODO (BACKEND INTEGRATION - NOT IMPLEMENTED YET)
            //
            // FE will call login API here, e.g.:
            // POST /api/login
            // body: { username, password }
            //
            // Backend responsibilities:
            // - validate credentials
            // - decide success / failure
            // - return token / session
            //
            // FE responsibilities AFTER backend is ready:
            // - if success  -> redirect to /home
            // - if failure  -> show generic error message
            //
            // ====================================================

            throw new Error('Backend not implemented');

        } catch (err) {
            // Generic error message as per Business Rule
            setError('Username hoặc mật khẩu không đúng.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
            <section className="w-full max-w-md p-8 bg-white rounded-xl shadow-xl">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Login
                    </h1>
                </header>

                {/* ===== LOGIN FORM ===== */}
                <form className="space-y-6" method="post" onSubmit={handleSubmit}>
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* Username */}
                    <div className="space-y-2">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            autoComplete="username"
                            disabled={isLoading}
                            className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg font-bold text-gray-900 transition-all duration-300 ease-in-out focus:outline-none focus:border-blue-600 disabled:opacity-50"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            disabled={isLoading}
                            className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg font-bold text-gray-900 transition-all duration-300 ease-in-out focus:outline-none focus:border-blue-600 disabled:opacity-50"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-bold text-lg shadow-md transition-all duration-300 ease-in-out hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Processing...' : 'Login'}
                    </button>

                    {/* Forgot Password */}
                    <div className="text-center">
                        <a
                            href="/forgot-password"
                            className="inline-block text-blue-600 font-medium hover:underline"
                        >
                            Forgot password?
                        </a>
                    </div>

                    {/* Register */}
                    <div>
                        <a
                            href="/register"
                            className="block w-full bg-gray-100 text-gray-800 text-center px-4 py-3 rounded-lg font-bold text-lg hover:bg-gray-200"
                        >
                            Register
                        </a>
                    </div>
                </form>
            </section>
        </main>
    );
}
