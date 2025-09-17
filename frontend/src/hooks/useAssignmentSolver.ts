import { useState, useEffect, useRef } from 'react';
import { solveAssignment, getJobStatus } from '../services/api';

type JobStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';

export const useAssignmentSolver = () => {
    const [file, setFile] = useState<File | null>(null);
    const [jobId, setJobId] = useState<string | null>(null);
    const [status, setStatus] = useState<JobStatus>('idle');
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // ✅ FIX: The ref can hold a number OR null, and must be initialized to null.
    const pollingRef = useRef<number | null>(null);

    useEffect(() => {
        if (jobId && status === 'processing') {
            // Note: We use window.setInterval to be explicit that this is browser-side
            pollingRef.current = window.setInterval(async () => {
                try {
                    const data = await getJobStatus(jobId);
                    setProgress(data.progress || 0);

                    if (data.state === 'completed') {
                        setStatus('completed');
                        const fileName = data.result.outputFilePath.split(/[/\\]/).pop(); // Handles both / and \ separators
                        setResultUrl(`http://localhost:5000/api/download/${fileName}`);
                        if (pollingRef.current) clearInterval(pollingRef.current);
                    } else if (data.state === 'failed') {
                        setStatus('failed');
                        setError(data.failedReason || 'An unknown error occurred.');
                        if (pollingRef.current) clearInterval(pollingRef.current);
                    }
                } catch (err) {
                    setStatus('failed');
                    setError('Could not get job status.');
                    if (pollingRef.current) clearInterval(pollingRef.current);
                }
            }, 3000);
        }

        // Cleanup function
        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
            }
        };
    }, [jobId, status]);

    const submitAssignment = async () => {
        if (!file) return;

        setStatus('uploading');
        setError(null);
        setProgress(0);
        setJobId(null);

        try {
            const data = await solveAssignment(file);
            setJobId(data.jobId);
            setStatus('processing');
        } catch (err) {
            setStatus('failed');
            setError('Failed to upload file.');
        }
    };

    return { file, setFile, submitAssignment, status, progress, resultUrl, error };
};