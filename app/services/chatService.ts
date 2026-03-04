import axiosInstance from './axiosConfig';

/**
 * Inspection Chat Service
 * Maps to Postman collection: S-40
 * Handles chat between inspector and seller during inspection
 */

// ============================================================
// TYPE DEFINITIONS
// ============================================================

interface SendTextMessageData {
  type: 'TEXT';
  text: string;
}

interface MarkChatAsReadData {
  lastReadMessageId: number;
}

// ============================================================
// S-40.1: LOAD CHAT THREAD
// ============================================================

/**
 * S-40.1: Load chat thread for an inspection request
 * GET /api/inspection-requests/{inspectionRequestId}/chat-thread
 * @param inspectionRequestId - The inspection request's ID
 * @returns Chat thread object (messages array, participants, timestamps)
 */
export const loadChatThread = async (inspectionRequestId: string) => {
  return axiosInstance.get(
    `/api/inspection-requests/${inspectionRequestId}/chat-thread`
  );
};

// ============================================================
// S-40.2: SEND TEXT MESSAGE
// ============================================================

/**
 * S-40.2: Send a text message in the chat
 * POST /api/inspection-requests/{inspectionRequestId}/chat-messages
 * @param inspectionRequestId - The inspection request's ID
 * @param data - Message data (type: 'TEXT', text)
 * @returns Sent message with messageId and timestamp
 */
export const sendTextMessage = async (
  inspectionRequestId: string,
  data: SendTextMessageData
) => {
  return axiosInstance.post(
    `/api/inspection-requests/${inspectionRequestId}/chat-messages`,
    data
  );
};

// ============================================================
// S-40.3: UPLOAD IMAGE MESSAGE
// ============================================================

/**
 * S-40.3: Upload and send an image message in the chat
 * POST /api/inspection-requests/{inspectionRequestId}/chat-messages:upload
 * @param inspectionRequestId - The inspection request's ID
 * @param formData - FormData containing:
 *   - file: Image file (JPEG, PNG, GIF, WebP, max 5MB)
 *   - caption: string (optional description)
 * @returns Uploaded message with imageUrl and messageId
 */
export const uploadImageMessage = async (
  inspectionRequestId: string,
  formData: FormData
) => {
  return axiosInstance.post(
    `/api/inspection-requests/${inspectionRequestId}/chat-messages:upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

// ============================================================
// S-40.4: MARK CHAT AS READ
// ============================================================

/**
 * S-40.4: Mark chat thread as read up to a specific message
 * POST /api/inspection-requests/{inspectionRequestId}/chat-thread/read
 * @param inspectionRequestId - The inspection request's ID
 * @param data - Read data (lastReadMessageId)
 * @returns Read status confirmation
 */
export const markChatAsRead = async (
  inspectionRequestId: string,
  data: MarkChatAsReadData
) => {
  return axiosInstance.post(
    `/api/inspection-requests/${inspectionRequestId}/chat-thread/read`,
    data
  );
};
