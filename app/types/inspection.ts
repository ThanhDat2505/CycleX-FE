export interface InspectionRequirement {
    requirementId: number;
    title: string;
    description: string;
    type: 'TEXT' | 'IMAGE' | 'FILE';
    required: boolean;
}

export interface InspectionFile {
    fileId: number;
    requirementId: number;
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
}

export interface InspectionResponseData {
    inspectionRequestId: number;
    listingId: number;
    status: string;
    requirements: InspectionRequirement[];
    existingAnswers: {
        requirementId: number;
        text: string;
    }[];
    existingFiles: InspectionFile[];
}

export interface SubmitAnswer {
    requirementId: number;
    text: string;
}

export interface SubmitResponseRequest {
    answers: SubmitAnswer[];
}
