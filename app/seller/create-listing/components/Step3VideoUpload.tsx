import React, { useRef } from "react";
import { LISTING_CONFIG } from "../constants";

interface Step3VideoUploadProps {
  videoUrl: string;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
  error?: string | null;
}

const Step3VideoUpload: React.FC<Step3VideoUploadProps> = ({
  videoUrl,
  isUploading,
  onUpload,
  onRemove,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Tải lên Video kiểm tra xe
      </h2>
      <p className="text-gray-600 text-sm mb-6">
        Quay video ngắn (tối đa {LISTING_CONFIG.MAX_VIDEO_DURATION} giây) để
        kiểm tra xem xe đạp có phát ra âm thanh kỳ lạ không. Video giúp tăng độ
        tin cậy cho người mua.
      </p>

      {/* Error Message */}
      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Lỗi: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Upload Area or Video Preview */}
      {videoUrl ? (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden max-w-lg mx-auto">
            <video
              src={videoUrl}
              controls
              className="w-full rounded-lg"
              style={{ maxHeight: "400px" }}
            >
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onRemove}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Xóa video
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isUploading
              ? "bg-gray-100 border-gray-400 cursor-wait"
              : "bg-gray-50 border-gray-300 hover:bg-gray-100 cursor-pointer"
          }`}
          onDrop={!isUploading ? handleDrop : undefined}
          onDragOver={!isUploading ? handleDragOver : undefined}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mb-2"></div>
              <p className="text-gray-600">Đang tải video...</p>
            </div>
          ) : (
            <>
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-900 font-medium mb-2">
                Nhấp để tải lên hoặc kéo thả video
              </p>
              <p className="text-gray-600 text-sm">
                MP4, WebM hoặc MOV (tối đa {LISTING_CONFIG.MAX_VIDEO_DURATION}{" "}
                giây)
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Quay video xe đạp đang chạy để kiểm tra âm thanh bất thường
              </p>
            </>
          )}
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Hướng dẫn quay video
        </h4>
        <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
          <li>Quay video xe đạp trong khi đạp/lăn bánh</li>
          <li>Lắng nghe và ghi lại âm thanh từ xích, phanh, bánh xe</li>
          <li>Video tối đa {LISTING_CONFIG.MAX_VIDEO_DURATION} giây</li>
          <li>Đảm bảo môi trường yên tĩnh để nghe rõ âm thanh</li>
        </ul>
      </div>

      <p className="text-sm text-gray-500 italic">
        * Video không bắt buộc nhưng giúp tăng độ tin cậy cho tin đăng.
      </p>
    </div>
  );
};

export default React.memo(Step3VideoUpload);
