/**
 * UI Messages Constants
 * Centralized messages for better maintainability and future i18n support
 */

export const MESSAGES = {
    // Empty States
    EMPTY_STATE_TITLE: 'Không tìm thấy kết quả',
    EMPTY_STATE_SUGGESTION: 'Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn',

    // Errors
    ERROR_LOADING_LISTINGS: 'Không thể tải danh sách sản phẩm. Vui lòng thử lại.',
    ERROR_LOADING: 'Không thể tải thông tin. Vui lòng thử lại.',
    ERROR_RETRY: 'Thử lại',

    // Page Titles
    PAGE_TITLE_SEARCH_RESULTS: 'Kết quả tìm kiếm',
    PAGE_TITLE_ALL_PRODUCTS: 'Tất cả sản phẩm',
    PRODUCTS_COUNT: 'sản phẩm',
    SHOWING_RESULTS: 'Hiển thị',

    // Filter Actions
    FILTER_CLEAR_ALL: 'Xóa tất cả',
    FILTER_APPLY: 'Áp Dụng Bộ Lọc',
    FILTER_SHOW_MORE: 'Xem thêm',
    FILTER_COLLAPSE: 'Thu gọn',

    // Filter Labels
    FILTER_TITLE: 'Bộ Lọc',
    FILTER_PRICE_RANGE: 'Khoảng Giá',
    FILTER_PRICE_MIN: 'Giá tối thiểu',
    FILTER_PRICE_MAX: 'Giá tối đa',
    FILTER_BIKE_TYPE: 'Loại Xe',
    FILTER_BRAND: 'Hãng Xe',
    FILTER_CONDITION: 'Tình Trạng',

    // Sorting
    SORT_LABEL: 'Sắp xếp:',

    // Pagination
    PAGINATION_PREVIOUS: '← Trước',
    PAGINATION_NEXT: 'Tiếp →',

    // Detail Page (S-32)
    DETAIL_BACK_TO_LISTINGS: 'Quay lại danh sách',
    DETAIL_VIEWS: 'lượt xem',
    DETAIL_NO_DESCRIPTION: 'Chưa có mô tả chi tiết',
    DETAIL_SELLER_INFO_COMING_SOON: 'Thông Tin Người Bán - Sắp Ra Mắt',
    DETAIL_INSPECTION_TITLE: 'Thông Tin Kiểm Định',
    DETAIL_INSPECTION_STATUS: 'Trạng thái',
    DETAIL_INSPECTION_DATE: 'Ngày kiểm định',
    DETAIL_INSPECTION_NOTES: 'Ghi chú',
    DETAIL_DESCRIPTION_TITLE: 'Mô Tả Chi Tiết',
    DETAIL_SPECIFICATIONS_TITLE: 'Thông Số Kỹ Thuật',
    DETAIL_NOT_FOUND: 'Không tìm thấy tin đăng',
    DETAIL_NOT_AVAILABLE: 'Tin đăng này không khả dụng',
    DETAIL_CONDITION_NEW: 'Mới',
    DETAIL_CONDITION_USED: 'Đã sử dụng',

    // Breadcrumbs
    BREADCRUMB_HOME: 'Trang chủ',
    BREADCRUMB_LISTINGS: 'Danh sách xe',

    // Detail Page - Specification Labels
    DETAIL_SPEC_BRAND: 'Thương hiệu:',
    DETAIL_SPEC_MODEL: 'Model:',
    DETAIL_SPEC_CONDITION: 'Tình trạng:',

    // Detail Page - Purchase CTA
    DETAIL_PURCHASE_BUTTON: 'Đặt mua ngay',
    DETAIL_PURCHASE_HINT: 'Bạn có thể chọn mua ngay hoặc đặt cọc ở bước tiếp theo',

    // Detail Page - Seller Info Placeholder
    DETAIL_SELLER_INFO_DESC: 'Thông tin người bán sẽ được hiển thị ở đây trong phiên bản tiếp theo',

    // Detail Page - Image Gallery
    DETAIL_NO_IMAGE: 'Không có hình ảnh',

    // S-50 Purchase Request
    S50_PAGE_TITLE: 'Đặt mua sản phẩm',
    S50_STEP1_TITLE: 'Thông tin yêu cầu',
    S50_STEP2_TITLE: 'Xác nhận giao dịch',
    S50_STEP2_SUBTITLE: 'Vui lòng kiểm tra kỹ thông tin trước khi gửi yêu cầu.',
    S50_STEP_INFO: 'Thông tin',
    S50_STEP_CONFIRM: 'Xác nhận',
    S50_PAYMENT_METHOD_LABEL: 'Phương thức thanh toán',
    S50_PAYMENT_PURCHASE_TITLE: 'Thanh toán toàn bộ (COD)',
    S50_PAYMENT_PURCHASE_DESC: 'Thanh toán 100% giá trị đơn hàng cho người bán khi nhận xe.',
    S50_PAYMENT_DEPOSIT_TITLE: 'Đặt cọc giữ chỗ (COD)',
    S50_PAYMENT_DEPOSIT_DESC: 'Đặt cọc một phần tiền để giữ xe. Phần còn lại thanh toán khi nhận xe.',
    S50_PAYMENT_ONLINE_TITLE: 'Thanh toán Online (Thẻ/Ví điện tử)',
    S50_PAYMENT_ONLINE_SOON: 'Coming Soon',
    S50_PAYMENT_ONLINE_DESC: 'Tính năng đang được phát triển.',
    S50_DEPOSIT_LABEL: 'Số tiền đặt cọc (VND)',
    S50_DEPOSIT_PLACEHOLDER: 'Ví dụ: 500000',
    S50_DEPOSIT_MIN_HINT: '* Tối thiểu 100,000 VND',
    S50_DATE_LABEL: 'Ngày nhận xe dự kiến',
    S50_DATE_MIN_HINT: '* Vui lòng đặt lịch trước ít nhất 3 ngày',
    S50_RECEIVER_SECTION_TITLE: 'Thông tin nhận hàng',
    S50_RECEIVER_NAME_LABEL: 'Họ tên người nhận',
    S50_RECEIVER_NAME_PLACEHOLDER: 'Nhập họ tên',
    S50_RECEIVER_PHONE_LABEL: 'Số điện thoại liên hệ',
    S50_RECEIVER_PHONE_PLACEHOLDER: 'Ví dụ: 0912345678',
    S50_RECEIVER_ADDRESS_LABEL: 'Địa chỉ nhận hàng chi tiết',
    S50_RECEIVER_ADDRESS_PLACEHOLDER: 'Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố...',
    S50_NOTE_LABEL: 'Ghi chú (Tùy chọn)',
    S50_NOTE_PLACEHOLDER: 'Nhập ghi chú cho người bán...',
    S50_BTN_CANCEL: 'Hủy bỏ',
    S50_BTN_NEXT: 'Tiếp theo',
    S50_BTN_BACK: 'Quay lại',
    S50_BTN_CONFIRM: 'Xác nhận đặt mua',
    S50_SUCCESS_TOAST: 'Yêu cầu đặt mua/đặt cọc đã được gửi thành công!',
    S50_ERROR_NO_LISTING: 'Không tìm thấy mã sản phẩm',
    S50_ERROR_NOT_AVAILABLE: 'Sản phẩm này không còn khả dụng để đặt mua',
    S50_ERROR_LOAD_LISTING: 'Không thể tải thông tin sản phẩm',
    S50_ERROR_ROLE: 'Chức năng này chỉ dành cho tài khoản Người mua (Buyer). Vui lòng đăng nhập với tài khoản Buyer.',
    S50_ERROR_SYSTEM: 'Lỗi hệ thống: Không tìm thấy thông tin sản phẩm hoặc người dùng.',
    S50_ERROR_SUBMIT: 'Không thể tạo yêu cầu. Vui lòng thử lại.',
    S50_ERROR_CHECK_INFO: 'Vui lòng kiểm tra lại thông tin đã nhập.',
    S50_ERROR_CHECK_STEP1: 'Vui lòng kiểm tra lại thông tin ở Bước 1.',
    S50_LOADING: 'Đang tải...',
    S50_EMPTY_TITLE: 'Không tìm thấy sản phẩm',
    S50_EMPTY_DESC: 'Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.',
    S50_EMPTY_ACTION: 'Quay lại danh sách',
    // S-50 Validation
    S50_VAL_PAYMENT_REQUIRED: 'Vui lòng chọn phương thức thanh toán',
    S50_VAL_DATE_REQUIRED: 'Vui lòng chọn ngày nhận xe dự kiến',
    S50_VAL_DATE_MIN: 'Ngày nhận xe phải sau ít nhất 3 ngày kể từ hôm nay',
    S50_VAL_DEPOSIT_POSITIVE: 'Số tiền đặt cọc phải lớn hơn 0',
    S50_VAL_DEPOSIT_MIN: 'Số tiền đặt cọc tối thiểu là 100,000 VND',
    S50_VAL_NAME_REQUIRED: 'Vui lòng nhập tên người nhận',
    S50_VAL_PHONE_REQUIRED: 'Vui lòng nhập số điện thoại liên hệ',
    S50_VAL_PHONE_INVALID: 'Số điện thoại không hợp lệ (cần 10 số, bắt đầu bằng số 0)',
    S50_VAL_ADDRESS_REQUIRED: 'Vui lòng nhập địa chỉ nhận hàng',
    // S-50 Review
    S50_REVIEW_TRANSACTION_TITLE: 'Giao dịch',
    S50_REVIEW_TYPE_LABEL: 'Loại giao dịch:',
    S50_REVIEW_TYPE_PURCHASE: 'Mua ngay (COD)',
    S50_REVIEW_TYPE_DEPOSIT: 'Đặt cọc (COD)',
    S50_REVIEW_DATE_LABEL: 'Ngày nhận xe:',
    S50_REVIEW_NOTE_LABEL: 'Ghi chú:',
    S50_REVIEW_RECEIVER_TITLE: 'Thông tin người nhận',
    S50_REVIEW_NAME_LABEL: 'Họ tên:',
    S50_REVIEW_PHONE_LABEL: 'Số điện thoại:',
    S50_REVIEW_ADDRESS_LABEL: 'Địa chỉ:',
    S50_REVIEW_FEE_TITLE: 'Chi tiết thanh toán',
    S50_REVIEW_ORDER_VALUE: 'Giá trị đơn hàng (tạm tính)',
    S50_REVIEW_PLATFORM_FEE: 'Phí dịch vụ',
    S50_REVIEW_INSPECTION_FEE: 'Phí kiểm định xe',
    S50_REVIEW_TOTAL: 'Tổng thanh toán',
    S50_REVIEW_SELLER_LABEL: 'Người bán',
    S50_REVIEW_SELLER_DEFAULT: 'Người bán',
    S50_REVIEW_TERMS: 'Bằng việc xác nhận, bạn đồng ý với',
    S50_REVIEW_TOS: 'Điều khoản dịch vụ',
    S50_REVIEW_PRIVACY: 'Chính sách bảo mật',
    S50_REVIEW_DEADLINE: 'Yêu cầu sẽ được gửi đến người bán và cần được xác nhận trong vòng 24h.',
    S50_NOTE_MAX_LENGTH: 500,
    S50_PHONE_MAX_LENGTH: 10,
} as const;
