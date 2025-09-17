import React from 'react';
import { FiUploadCloud } from 'react-icons/fi';

interface FileUploadProps {
    file: File | null;
    setFile: (file: File | null) => void;
    onSubmit: () => void;
    isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ file, setFile, onSubmit, isLoading }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };
    
    return (
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
                <label htmlFor="file-upload" className="block mb-2 text-sm font-medium text-gray-700">
                    Upload your assignment file:
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                            <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                            >
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.docx" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF or DOCX</p>
                    </div>
                </div>
                {file && <p className="mt-2 text-sm font-medium text-gray-600">Selected file: {file.name}</p>}
            </div>

            <button
                type="submit"
                disabled={!file || isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? 'Processing...' : 'Solve Assignment'}
            </button>
        </form>
    );
};