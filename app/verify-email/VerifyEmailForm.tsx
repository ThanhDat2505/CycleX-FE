/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, Button, ErrorMessage } from "@/app/components/ui";
import { authService } from "@/app/services/authService";
import { validateOtp } from "@/app/utils/validation";
import { handleAuthError } from "@/app/utils/errorHandler";

/**
 * VerifyEmailForm Component
 * BR-12: Email verification using OTP
 * BR-13: Resend OTP functionality
 * BR-14: Verify success → redirect to login
 */
export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";

  // Form state
  const [email, setEmail] = useState(emailFromUrl);
  const [otp, setOtp] = useState("");

  // UI state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Resend cooldown timer (BR-13)
  const [resendCooldown, setResendCooldown] = useState(0);

  // OTP expiration timer (BR-12)
  const [otpExpiration, setOtpExpiration] = useState(120); // 2 minutes default

  // Resend cooldown timer effect
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000,
      );
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
    setError("");
    setSuccess("");

    // Client-side validation
    if (!email) {
      setError("Email là bắt buộc");
      return;
    }

    if (!otp) {
      setError("Mã OTP là bắt buộc");
      return;
    }

    if (!validateOtp(otp)) {
      setError("Mã OTP phải gồm 6 chữ số");
      return;
    }

    // BR-12: Check if OTP expired
    if (otpExpiration <= 0) {
      setError("Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.");
      return;
    }

    setIsLoading(true);

    try {
      // BR-12: Verify OTP
      const response = await authService.verifyOtp(email, otp);

      // Official API returns message and user object
      if (response.message) {
        setSuccess(
          "Xác thực email thành công! Đang chuyển sang trang đăng nhập...",
        );

        // BR-14: Redirect to login after successful verification
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err: any) {
      // Handle specific error cases from official API
      if (err.status === 423) {
        // OTP Locked after 3 failed attempts
        setError("Mã OTP đã bị khóa. Vui lòng yêu cầu mã OTP mới.");
      } else if (err.status === 400) {
        // Check specific 400 error messages
        if (err.message.includes("expired")) {
          setError("Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.");
        } else if (err.message.includes("Invalid OTP")) {
          setError("Mã OTP không đúng. Vui lòng thử lại.");
        } else {
          setError("Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.");
        }
      } else if (err.status === 404) {
        setError("Email không tồn tại. Vui lòng đăng ký trước.");
      } else {
        setError(handleAuthError(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email là bắt buộc");
      return;
    }

    if (resendCooldown > 0) {
      setError(`Vui lòng chờ ${resendCooldown} giây trước khi gửi lại`);
      return;
    }

    setIsResending(true);

    try {
      // BR-13: Send OTP (official API)
      const response = await authService.sendOtp(email);

      // Official API just returns message
      if (response.message) {
        setSuccess(response.message);
        setResendCooldown(60); // 60 seconds cooldown
        setOtpExpiration(120); // Reset to 2 minutes
        setOtp(""); // Clear old OTP input
      }
    } catch (err: any) {
      if (err.status === 404) {
        setError("Email not found. Please register first.");
      } else if (err.status === 429) {
        setError("Too many requests. Please try again later.");
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
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
            Mã OTP hết hạn sau:{" "}
            <span className="font-semibold">{formatTime(otpExpiration)}</span>
          </p>
        )}
        {otpExpiration <= 0 && (
          <p className="text-xs text-red-600 mt-1">
            Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.
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
        Xác Thực Email
      </Button>

      {/* Resend OTP */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Bạn chưa nhận được mã?{" "}
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0 || isResending}
            className={`font-semibold ${
              resendCooldown > 0 || isResending
                ? "text-gray-400 cursor-not-allowed"
                : "text-brand-primary hover:underline"
            }`}
          >
            {isResending
              ? "Đang gửi..."
              : resendCooldown > 0
                ? `Gửi lại (${resendCooldown}s)`
                : "Gửi lại OTP"}
          </button>
        </p>
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          <strong>Lưu ý:</strong> Kiểm tra hộp thư đến (và thư rác) để tìm mã
          OTP 6 chữ số. Bạn phải xác thực email trước khi có thể đăng nhập.
        </p>
      </div>
    </div>
  );
}
