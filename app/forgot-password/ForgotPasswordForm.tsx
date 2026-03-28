"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input, Button, ErrorMessage } from "@/app/components/ui";
import { authService } from "@/app/services/authService";
import { validateEmail, validatePasswordRegister, validateOtp } from "@/app/utils/validation";
import { handleAuthError } from "@/app/utils/errorHandler";

const STYLES = {
  form: "space-y-6",
  inputWrapper: "space-y-5 animate-fade-in delay-100",
  backLink: "block text-center mt-6 text-sm text-brand-primary hover:underline font-bold transition-colors",
  successText: "text-green-600 text-center text-sm font-medium p-3 bg-green-50 rounded-lg animate-fade-in",
  guideText: "text-sm text-gray-500 text-center mb-4",
} as const;

export function ForgotPasswordForm() {
  const router = useRouter();

  // Multi-step State
  const [step, setStep] = useState<1 | 2>(1);

  // Form Fields State
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Status State
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Handle Email Submission -> Request OTP
  const handleRequestOtp = useCallback(async () => {
    setError("");
    setSuccessMsg("");

    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email không hợp lệ");
      return;
    }

    setIsLoading(true);

    try {
      // Gọi service quên mật khẩu (sửa endpoint phía Backend sau này)
      await authService.forgotPassword(email);
      setSuccessMsg("Mã OTP đã được gửi đến email của bạn.");
      setStep(2);
    } catch (err: any) {
      setError(handleAuthError(err));
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  // Step 2: Handle OTP & New Password Submission
  const handleResetPassword = useCallback(async () => {
    setError("");
    setSuccessMsg("");

    if (!otp || !newPassword || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (!validateOtp(otp)) {
      setError("Mã OTP phải gồm 6 chữ số");
      return;
    }

    if (!validatePasswordRegister(newPassword)) {
      setError("Mật khẩu mới phải từ 6 đến 20 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setIsLoading(true);

    try {
      // Gọi service đặt lại mật khẩu
      await authService.resetPassword(email, otp, newPassword);
      setSuccessMsg("Đổi mật khẩu thành công! Chuyển hướng về đăng nhập...");
      
      // Thành công -> delay 2s rồi quay lại login
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (err: any) {
      setError(handleAuthError(err));
      setIsLoading(false);
    }
  }, [email, otp, newPassword, confirmPassword, router]);

  const onFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (step === 1) {
        handleRequestOtp();
      } else {
        handleResetPassword();
      }
    },
    [step, handleRequestOtp, handleResetPassword]
  );

  return (
    <form className={STYLES.form} onSubmit={onFormSubmit}>
      <ErrorMessage message={error} />
      {successMsg && <div className={STYLES.successText}>{successMsg}</div>}

      <div className={STYLES.inputWrapper}>
        {step === 1 && (
          <>
            <p className={STYLES.guideText}>
              Nhập email đã đăng ký của bạn để nhận mã xác nhận đặt lại mật khẩu.
            </p>
            <Input
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="email@example.com"
              disabled={isLoading}
            />
          </>
        )}

        {step === 2 && (
          <>
            <p className={STYLES.guideText}>
              Vui lòng kiểm tra email <strong>{email}</strong> để lấy mã xác nhận.
            </p>
            <Input
              label="Mã OTP"
              id="otp"
              type="text"
              value={otp}
              onChange={setOtp}
              placeholder="Nhập 6 số OTP"
              maxLength={6}
              disabled={isLoading}
            />

            <Input
              label="Mật khẩu mới"
              id="new-password"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
              placeholder="••••••••"
              disabled={isLoading}
            />

            <Input
              label="Xác nhận mật khẩu"
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </>
        )}
      </div>

      <Button
        type="submit"
        loading={isLoading}
        className="w-full py-4 text-lg font-bold shadow-xl shadow-brand-primary/10"
      >
        {step === 1 ? "Gửi mã xác nhận" : "Đặt lại mật khẩu"}
      </Button>

      {/* Nút quay lại login */}
      <Link href="/login" className={STYLES.backLink}>
        Quay lại trang Đăng nhập
      </Link>
    </form>
  );
}
