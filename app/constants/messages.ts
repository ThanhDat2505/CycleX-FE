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
} as const;
