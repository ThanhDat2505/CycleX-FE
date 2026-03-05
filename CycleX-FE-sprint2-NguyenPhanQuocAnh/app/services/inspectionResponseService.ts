import axiosInstance from './axiosConfig';

/**
 * Inspection Response Service
 * Maps to Postman collection: S-42
 * Seller responds to inspection requirements with files and answers
 */

// ============================================================
// TYPE DEFINITIONS
// ============================================================

interface UploadDraftFileResponse {
  fileId: number;
  fileName: string;
  uploadDate: string;
}

interface SubmitResponseRequest {
  answers: Array<{
    requirementId: number;
    text: string;
  }>;
}

interface InspectionResponseData {
  inspectionRequestId: number;
  listingId: number;
  status: string;
  requirements: Array<{
    requirementId: number;
    title: string;
    description: string;
    type: 'TEXT' | 'IMAGE' | 'FILE';
    required: boolean;
  }>;
  existingAnswers: Array<{
    requirementId: number;
    text: string;
  }>;
  existingFiles: Array<{
    fileId: number;
    fileName: string;
    uploadDate: string;
  }>;
}

// ============================================================
// S-42.1: LOAD INSPECTION RESPONSE SCREEN
// ============================================================

/**
 * S-42.1: Load inspection response screen data
 * GET /api/seller/listings/{listingId}/inspection-response
 * @param listingId - The listing's ID
 * @returns Requirements list with file upload fields and text answer fields
 */
export const getInspectionResponseData = async (
  listingId: number
): Promise<InspectionResponseData> => {
  return axiosInstance.get(
    `/api/seller/listings/${listingId}/inspection-response`
  );
};

// ============================================================
// S-42.2: UPLOAD DRAFT FILE
// ============================================================

/**
 * S-42.2: Upload a draft file as evidence for a requirement
 * POST /api/seller/inspection-requests/{inspectionRequestId}/response/requirements/{requirementId}/files
 * @param inspectionRequestId - The inspection request's ID
 * @param requirementId - The requirement's ID
 * @param formData - FormData containing:
 *   - file: Any file type for inspection evidence
 * @returns Uploaded file with fileId, fileName, uploadDate
 */
export const uploadDraftFile = async (
  inspectionRequestId: string,
  requirementId: string,
  formData: FormData
) => {
  return axiosInstance.post(
    `/api/seller/inspection-requests/${inspectionRequestId}/response/requirements/${requirementId}/files`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

// ============================================================
// S-42.3: DELETE DRAFT FILE
// ============================================================

/**
 * S-42.3: Delete a draft file that was uploaded
 * DELETE /api/seller/inspection-requests/{inspectionRequestId}/response/files/{fileId}
 * @param inspectionRequestId - The inspection request's ID
 * @param fileId - The file's ID
 * @returns Deletion confirmation
 */
export const deleteDraftFile = async (
  inspectionRequestId: string,
  fileId: string
) => {
  return axiosInstance.delete(
    `/api/seller/inspection-requests/${inspectionRequestId}/response/files/${fileId}`
  );
};

// ============================================================
// S-42.4: SUBMIT INSPECTION RESPONSE
// ============================================================

/**
 * S-42.4: Submit the inspection response with answers and uploaded files
 * POST /api/seller/inspection-requests/{inspectionRequestId}/response/submit
 * @param inspectionRequestId - The inspection request's ID
 * @param data - Response data containing answers array
 * @returns Submission confirmation (status: SUBMITTED)
 */
export const submitInspectionResponse = async (
  inspectionRequestId: string,
  data: SubmitResponseRequest
) => {
  return axiosInstance.post(
    `/api/seller/inspection-requests/${inspectionRequestId}/response/submit`,
    data
  );
};

