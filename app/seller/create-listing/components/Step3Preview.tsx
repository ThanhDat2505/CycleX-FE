import React from "react";
import { ListingFormData } from "../types";
import { formatBikeType, formatCondition } from "@/app/utils/format";

interface Step3PreviewProps {
  formData: ListingFormData;
  imageUrls: string[];
}

const VND_FORMATTER = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const Step3Preview: React.FC<Step3PreviewProps> = ({ formData, imageUrls }) => {
  const formattedPrice = VND_FORMATTER.format(Number(formData.price || 0));
  const pickupAddress = formData.pickupAddress || formData.location;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Xem trước tin đăng</h2>
      <div className="bg-gray-50 p-6 rounded-lg space-y-4 border border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Tiêu đề</p>
            <p className="font-semibold text-gray-900">{formData.title}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Giá bán</p>
            <p className="font-semibold text-brand-primary">{formattedPrice}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Loại xe</p>
            <p className="font-semibold text-gray-900">
              {formatBikeType(formData.category)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tình trạng</p>
            <p className="font-semibold text-gray-900">
              {formatCondition(formData.condition)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Hãng / Dòng xe / Năm</p>
            <p className="font-semibold text-gray-900">
              {formData.brand} / {formData.model} / {formData.year}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tỉnh/Thành phố</p>
            <p className="font-semibold text-gray-900">{formData.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Địa chỉ xem xe</p>
            <p className="font-semibold text-gray-900">{pickupAddress}</p>
          </div>
          {formData.usageTime && (
            <div>
              <p className="text-sm text-gray-500">Thời gian sử dụng</p>
              <p className="font-semibold text-gray-900">
                {formData.usageTime}
              </p>
            </div>
          )}
          {formData.reasonForSale && (
            <div>
              <p className="text-sm text-gray-500">Lý do bán</p>
              <p className="font-semibold text-gray-900">
                {formData.reasonForSale}
              </p>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-500">Mô tả chi tiết</p>
          <p className="text-gray-900 mt-1 whitespace-pre-wrap">
            {formData.description}
          </p>
        </div>
      </div>

      {/* Images Preview */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Hình ảnh ({imageUrls.length})
        </h3>
        {imageUrls.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imageUrls.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
              >
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Chưa có hình ảnh nào được tải lên</p>
        )}
      </div>

      {/* Video Preview */}
      {formData.videoUrl && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Video kiểm tra xe
          </h3>
          <div className="max-w-lg">
            <video
              src={formData.videoUrl}
              controls
              className="w-full rounded-lg"
              style={{ maxHeight: "300px" }}
            >
              Trình duyệt không hỗ trợ video.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Step3Preview);
