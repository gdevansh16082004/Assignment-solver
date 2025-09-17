import React, { useState } from 'react';

type FileUploadProps = {
    onUploadComplete: (pdfFile: File) => void;
};

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (file) {
            onUploadComplete(file);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded shadow-md">
            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                           file:rounded file:border-0
                           file:text-sm file:font-semibold
                           file:bg-blue-500 file:text-white
                           hover:file:bg-blue-600"
            />
            <button
                onClick={handleUpload}
                disabled={!file}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
                Upload and Solve
            </button>
        </div>
    );
};

export default FileUpload;
