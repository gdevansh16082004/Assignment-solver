interface StatusDisplayProps {
    status: 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';
    progress: number;
    resultUrl: string | null;
    error: string | null;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({ status, progress, resultUrl, error }) => {
    if (status === 'idle') return null;

    return (
        <div className="w-full mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            {status === 'uploading' && <p className="text-gray-700">Uploading file...</p>}
            {status === 'processing' && (
                <div>
                    <p className="font-semibold text-blue-600">Agent is working on your assignment...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-right text-sm text-gray-500">{Math.round(progress)}%</p>
                </div>
            )}
            {status === 'completed' && (
                <div className="text-center">
                    <p className="font-semibold text-green-600 mb-4">✅ Success! Your solved assignment is ready.</p>
                    <a
                        href={resultUrl!}
                        download="assignment-answers.pdf"
                        className="inline-block bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700"
                    >
                        Download PDF
                    </a>
                </div>
            )}
            {status === 'failed' && (
                <div>
                    <p className="font-semibold text-red-600">❌ Error</p>
                    <p className="text-red-500 mt-1">{error}</p>
                </div>
            )}
        </div>
    );
};