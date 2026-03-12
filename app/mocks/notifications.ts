import { NotificationResponse } from '@/app/types/notification';

// Pre-seeded database of mock notifications
export const mockNotificationsDB: Record<number, NotificationResponse[]> = {
    // User 1 (Buyer/Seller test logic)
    1: [
        {
            id: 101,
            title: 'Bài đăng được duyệt',
            message: 'Bài đăng "Xe đạp thể thao X-Bike 2024" của bạn đã được kiểm duyệt viên chấp thuận.',
            type: 'LISTING_RELATED',
            relatedId: 1, // Listing ID 1
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 mins ago
        },
        {
            id: 102,
            title: 'Yêu cầu mua xe MỚI!',
            message: 'Người mua cuongbuyer@cyclex.com vừa gửi yêu cầu mua xe đạp cũ Trek Marlin 5.',
            type: 'TRANSACTION_RELATED',
            relatedId: 10, // Purchase Request ID 10
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
        },
        {
            id: 103,
            title: 'Kết quả giao hàng',
            message: 'Đơn hàng TRX-1002 giao thất bại. Trạng thái giao dịch chuyển sang Tranh chấp.',
            type: 'DISPUTE_RELATED',
            relatedId: 12, // Transaction ID 12
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
        },
        {
            id: 104,
            title: 'Cập nhật Tranh chấp',
            message: 'Admin đã đưa ra phán quyết cuối cùng cho giao dịch TRX-0901. Hoàn tiền 100%.',
            type: 'DISPUTE_RELATED',
            relatedId: 8,
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() // 3 days ago
        }
    ],
    // User 3 (Shipper)
    3: [
        {
            id: 201,
            title: 'Chỉ định giao hàng mới',
            message: 'Bạn vừa được hệ thống chỉ định giao đơn hàng TRX-1005. Bấm vào đây để xem chi tiết.',
            type: 'TRANSACTION_RELATED',
            relatedId: 15, // Transaction ID 15/Delivery ID 15
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 mins ago
        }
    ]
};
