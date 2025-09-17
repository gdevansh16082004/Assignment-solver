import { useState, type ChangeEvent } from 'react';
import axios from 'axios';

interface UploadFormProps {
    onUploadSuccess: (taskId: string) => void;
}

function UploadForm({ onUploadSuccess }: UploadFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('pdf', file);

        setUploading(true);

        const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/upload-assessment`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        const { taskId } = res.data;
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/embed-chunks`, { taskId });
        onUploadSuccess(taskId);

        setUploading(false);
    };

    return (
        <div className="max-w-xl mx-auto p-4">
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                onClick={handleUpload}
                disabled={uploading}
            >
                {uploading ? 'Uploading...' : 'Upload Assessment'}
            </button>
        </div>
    );
}

export default UploadForm;
