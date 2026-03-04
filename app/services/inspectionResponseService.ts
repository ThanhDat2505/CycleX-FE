import axiosInstance from './axiosConfig';
import {
    InspectionResponseData,
    SubmitResponseRequest
} from '../types/inspection';

const USE_MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === 'true';

/**
 * S-42.1: Load Inspection Response Screen
 * GET /api/seller/listings/{listingId}/inspection-response
 */
export const getInspectionResponseData = async (listingId: number): Promise<InspectionResponseData> => {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
            inspectionRequestId: 123,
            listingId: listingId,
            status: 'PENDING_SELLER_RESPONSE',
            requirements: [
                {
                    requirementId: 1,
                    title: 'Service History',
                    description: 'Please describe the maintenance history of the bike.',
                    type: 'TEXT',
                    required: true
                },
                {
                    requirementId: 2,
                    title: 'Frame Condition',
                    description: 'Any scratches or dents on the frame?',
                    type: 'TEXT',
                    required: false
                },
                {
                    requirementId: 3,
                    title: 'Engine/Component Photos',
                    description: 'Upload clear photos of the drive train and engine area.',
                    type: 'IMAGE',
                    required: true
                }
            ],
            existingAnswers: [],
            existingFiles: []
        };
    }
    return axiosInstance.get(`/api/seller/listings/${listingId}/inspection-response`);
};

/**
 * S-42.2: Upload Draft File
 * POST /api/seller/inspection-requests/{inspectionRequestId}/response/requirements/{requirementId}/files
 */
export const uploadInspectionFile = async (
    inspectionRequestId: number,
    requirementId: number,
    file: File
): Promise<{ fileId: number; fileUrl: string }> => {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
            fileId: Math.floor(Math.random() * 1000),
            fileUrl: URL.createObjectURL(file)
        };
    }

    const formData = new FormData();
    formData.append('file', file);

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

/**
 * S-42.3: Delete Draft File
 * DELETE /api/seller/inspection-requests/{inspectionRequestId}/response/files/{fileId}
 */
export const deleteInspectionFile = async (
    inspectionRequestId: number,
    fileId: number
): Promise<void> => {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return;
    }
    return axiosInstance.delete(
        `/api/seller/inspection-requests/${inspectionRequestId}/response/files/${fileId}`
    );
};

/**
 * S-42.4: Submit Inspection Response
 * POST /api/seller/inspection-requests/{inspectionRequestId}/response/submit
 */
export const submitInspectionResponse = async (
    inspectionRequestId: number,
    data: SubmitResponseRequest
): Promise<void> => {
    if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Submitted response:', data);
        return;
    }
    return axiosInstance.post(
        `/api/seller/inspection-requests/${inspectionRequestId}/response/submit`,
        data
    );
};
