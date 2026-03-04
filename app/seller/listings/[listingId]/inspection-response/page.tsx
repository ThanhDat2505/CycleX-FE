"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    getInspectionResponseData,
    uploadInspectionFile,
    deleteInspectionFile,
    submitInspectionResponse
} from '@/app/services/inspectionResponseService';
import { InspectionRequirement, InspectionResponseData, SubmitAnswer } from '@/app/types/inspection';
import { useToast } from '@/app/contexts/ToastContext';
import { useAuth } from '@/app/hooks/useAuth';

const InspectionResponsePage = () => {
    const { listingId } = useParams();
    const router = useRouter();
    const { addToast } = useToast();
    const { isLoggedIn, isLoading: authLoading } = useAuth();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState<InspectionResponseData | null>(null);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [uploadedFiles, setUploadedFiles] = useState<Record<number, { fileId: number; fileUrl: string }[]>>({});
    const [uploadingRequirementId, setUploadingRequirementId] = useState<number | null>(null);

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const result = await getInspectionResponseData(Number(listingId));
                setData(result);

                // Initialize answers
                const initialAnswers: Record<number, string> = {};
                result.existingAnswers.forEach(ans => {
                    initialAnswers[ans.requirementId] = ans.text;
                });
                setAnswers(initialAnswers);

                // Initialize files
                const initialFiles: Record<number, { fileId: number; fileUrl: string }[]> = {};
                result.existingFiles.forEach(file => {
                    if (!initialFiles[file.requirementId]) initialFiles[file.requirementId] = [];
                    initialFiles[file.requirementId].push({ fileId: file.fileId, fileUrl: file.fileUrl });
                });
                setUploadedFiles(initialFiles);

                setLoading(false);
            } catch (error) {
                addToast('Failed to load inspection data', 'error');
                setLoading(false);
            }
        };

        if (isLoggedIn) {
            fetchData();
        }
    }, [listingId, isLoggedIn, authLoading, router, addToast]);

    const handleTextChange = (requirementId: number, value: string) => {
        setAnswers(prev => ({ ...prev, [requirementId]: value }));
    };

    const handleFileUpload = async (requirementId: number, file: File) => {
        if (!data) return;

        setUploadingRequirementId(requirementId);
        try {
            const result = await uploadInspectionFile(data.inspectionRequestId, requirementId, file);
            setUploadedFiles(prev => ({
                ...prev,
                [requirementId]: [...(prev[requirementId] || []), result]
            }));
            addToast('File uploaded successfully', 'success');
        } catch (error) {
            addToast('Upload failed', 'error');
        } finally {
            setUploadingRequirementId(null);
        }
    };

    const handleFileDelete = async (requirementId: number, fileId: number) => {
        if (!data) return;

        try {
            await deleteInspectionFile(data.inspectionRequestId, fileId);
            setUploadedFiles(prev => ({
                ...prev,
                [requirementId]: prev[requirementId].filter(f => f.fileId !== fileId)
            }));
            addToast('File removed', 'success');
        } catch (error) {
            addToast('Failed to remove file', 'error');
        }
    };

    const handleSubmit = async () => {
        if (!data) return;

        // Basic validation
        const missingRequired = data.requirements
            .filter(r => r.required)
            .filter(r => {
                if (r.type === 'TEXT') return !answers[r.requirementId]?.trim();
                if (r.type === 'IMAGE' || r.type === 'FILE') return !uploadedFiles[r.requirementId]?.length;
                return false;
            });

        if (missingRequired.length > 0) {
            addToast(`Please complete all required fields: ${missingRequired.map(r => r.title).join(', ')}`, 'error');
            return;
        }

        setSubmitting(true);
        try {
            const submitAnswers: SubmitAnswer[] = Object.entries(answers).map(([id, text]) => ({
                requirementId: Number(id),
                text
            }));

            await submitInspectionResponse(data.inspectionRequestId, { answers: submitAnswers });
            addToast('Response submitted successfully!', 'success');
            router.push('/seller/dashboard');
        } catch (error) {
            addToast('Submission failed', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4 transition-colors"
                    >
                        ← Back to Listings
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Inspection Response</h1>
                    <p className="mt-2 text-gray-600">
                        Inspector from CycleX is requesting more information. Please provide the details below.
                    </p>
                </div>

                <div className="space-y-6">
                    {data?.requirements.map((req) => (
                        <div key={req.requirementId} className="bg-white shadow-sm border border-gray-100 rounded-xl p-6 transition-all hover:shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        {req.title}
                                        {req.required && <span className="text-red-500 text-xs font-normal bg-red-50 px-2 py-0.5 rounded-full">Required</span>}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">{req.description}</p>
                                </div>
                            </div>

                            {req.type === 'TEXT' ? (
                                <textarea
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                    rows={4}
                                    placeholder="Enter your response here..."
                                    value={answers[req.requirementId] || ''}
                                    onChange={(e) => handleTextChange(req.requirementId, e.target.value)}
                                />
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {uploadedFiles[req.requirementId]?.map((file) => (
                                            <div key={file.fileId} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                                                {req.type === 'IMAGE' ? (
                                                    <img src={file.fileUrl} alt="Evidence" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                                                        <span className="text-4xl mb-1">📄</span>
                                                        <span className="text-xs text-gray-500 truncate w-full px-2">Uploaded File</span>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => handleFileDelete(req.requirementId, file.fileId)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}

                                        <label className={`cursor-pointer aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all
                      ${uploadingRequirementId === req.requirementId ? 'opacity-50 pointer-events-none' : ''}`}>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept={req.type === 'IMAGE' ? "image/*" : "*/*"}
                                                onChange={(e) => e.target.files?.[0] && handleFileUpload(req.requirementId, e.target.files[0])}
                                            />
                                            {uploadingRequirementId === req.requirementId ? (
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                            ) : (
                                                <>
                                                    <span className="text-2xl text-gray-400">+</span>
                                                    <span className="text-xs text-gray-500 mt-1">Upload {req.type === 'IMAGE' ? 'Image' : 'File'}</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-10 flex gap-4">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50 shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {submitting ? 'Submitting...' : 'Send Response'}
                    </button>
                    <button
                        onClick={() => router.back()}
                        disabled={submitting}
                        className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            <style jsx>{`
        .bg-primary { background-color: #FF8A00; }
        .bg-primary-dark { background-color: #E67E00; }
        .border-primary { border-color: #FF8A00; }
        .text-primary { color: #FF8A00; }
        .focus\:ring-primary\/20:focus { --tw-ring-color: rgba(255, 138, 0, 0.2); }
        .hover\:border-primary\/50:hover { border-color: rgba(255, 138, 0, 0.5); }
        .hover\:bg-primary\/5:hover { background-color: rgba(255, 138, 0, 0.05); }
        .shadow-primary\/20 { --tw-shadow-color: rgba(255, 138, 0, 0.2); }
      `}</style>
        </div>
    );
};

export default InspectionResponsePage;
