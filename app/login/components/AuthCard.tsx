import { ReactNode } from 'react';
import { authTheme } from '../auth.styles';

interface AuthCardProps {
  title: string;
  children: ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps) {
  return (
    <div className={`${authTheme.card} p-10 w-full max-w-md`}>
      {/* Logo Section */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#FF6B00] rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-800">
            Cycle<span className="text-[#FF6B00]">X</span>
          </span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
        {title}
      </h1>

      {/* Form Content */}
      <div className="space-y-5">
        {children}
      </div>
    </div>
  );
}