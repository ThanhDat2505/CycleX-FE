"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { userService } from "@/app/services/userService";
import {
  UserProfileResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "@/app/types/user";
import { MESSAGES } from "@/app/constants/messages";
import { useToast } from "@/app/contexts/ToastContext";
import { ProfileInfoForm } from "./components/ProfileInfoForm";
import { ChangePasswordForm } from "./components/ChangePasswordForm";
import { User, Lock, ChevronRight, MapPin } from "lucide-react";
import AddressManagement from "@/app/components/address/AddressManagement";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { addToast } = useToast();

  // S-04-BR01 Check: Enforce user login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const [activeTab, setActiveTab] = useState<"info" | "security" | "addresses">(
    "info",
  );
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.userId) return;
      try {
        setIsLoading(true);
        const data = await userService.getUserProfile(user.userId);
        if (data) {
          setProfile(data);
        }
      } catch {
        addToast(MESSAGES.S04_ERROR_LOAD, "error");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user, addToast]);

  const handleUpdateProfile = async (data: UpdateProfileRequest) => {
    if (!profile?.userId) return;
    try {
      setIsUpdatingProfile(true);
      const updatedProfile = await userService.updateUserProfile(
        profile.userId,
        data,
      );
      setProfile(updatedProfile);
      addToast(MESSAGES.S04_SUCCESS_PROFILE, "success");
    } catch {
      addToast(MESSAGES.S04_ERROR_UPDATE_PROFILE, "error");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (data: ChangePasswordRequest) => {
    if (!profile?.userId) return;
    try {
      setIsChangingPassword(true);
      await userService.changePassword(profile.userId, data);
      addToast(MESSAGES.S04_SUCCESS_PASSWORD, "success");
      // Reset form by clearing fields inside form (form handles its own state, but we can just show success here)
    } catch (error: unknown) {
      const errorMsg =
        (error as Error)?.message || MESSAGES.S04_ERROR_CHANGE_PASSWORD;
      addToast(errorMsg, "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex justify-center items-center">
        <span className="flex items-center gap-2">
          <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Đang tải...
        </span>
      </div>
    );
  }

  if (!user || !profile) return null; // Prevent UI flash before redirect

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-primary transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900 font-medium">
            {MESSAGES.S04_PAGE_TITLE}
          </span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row min-h-[600px]">
            {/* Sidebar */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50 p-6">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-6">
                Cài đặt
              </h2>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    activeTab === "info"
                      ? "bg-orange-50 text-brand-primary shadow-sm ring-1 ring-brand-primary/10"
                      : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                  }`}
                >
                  <User
                    className={`w-5 h-5 mr-3 ${activeTab === "info" ? "text-brand-primary" : "text-gray-400"}`}
                  />
                  {MESSAGES.S04_TAB_INFO}
                </button>

                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    activeTab === "security"
                      ? "bg-orange-50 text-brand-primary shadow-sm ring-1 ring-brand-primary/10"
                      : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                  }`}
                >
                  <Lock
                    className={`w-5 h-5 mr-3 ${activeTab === "security" ? "text-brand-primary" : "text-gray-400"}`}
                  />
                  {MESSAGES.S04_TAB_SECURITY}
                </button>

                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    activeTab === "addresses"
                      ? "bg-orange-50 text-brand-primary shadow-sm ring-1 ring-brand-primary/10"
                      : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                  }`}
                >
                  <MapPin
                    className={`w-5 h-5 mr-3 ${activeTab === "addresses" ? "text-brand-primary" : "text-gray-400"}`}
                  />
                  Địa chỉ
                </button>
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 sm:p-10">
              {activeTab === "info" && (
                <div className="space-y-6 max-w-2xl">
                  <div className="border-b border-gray-200 pb-5">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Hồ sơ của bạn
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                      Quản lý thông tin cá nhân và cách bạn hiển thị với người
                      khác trên CycleX.
                    </p>
                  </div>
                  <ProfileInfoForm
                    profile={profile}
                    isSubmitting={isUpdatingProfile}
                    onSubmit={handleUpdateProfile}
                    onImageError={(msg) => addToast(msg, "error")}
                  />
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6 max-w-2xl">
                  <div className="border-b border-gray-200 pb-5">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Bảo mật tài khoản
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                      Vui lòng tạo một mật khẩu mạnh để bảo vệ tài khoản của
                      bạn.
                    </p>
                  </div>
                  <ChangePasswordForm
                    isSubmitting={isChangingPassword}
                    onSubmit={handleChangePassword}
                  />
                </div>
              )}

              {activeTab === "addresses" && (
                <div className="space-y-6 max-w-2xl">
                  <div className="border-b border-gray-200 pb-5">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Quản lý địa chỉ
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                      Thêm và quản lý các địa chỉ giao hàng. Địa chỉ mặc định sẽ
                      được tự động điền khi đặt hàng.
                    </p>
                  </div>
                  <AddressManagement
                    userId={profile.userId}
                    onError={(msg) => addToast(msg, "error")}
                    onSuccess={(msg) => addToast(msg, "success")}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
