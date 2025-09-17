// import { useState } from 'react';
// import UploadForm from '../components/UploadForm';
// import QuestionForm from '../components/QuestionForm';

// function Home() {
//     const [taskId, setTaskId] = useState<string | null>(null);

//     return (
//         <div className="max-w-2xl mx-auto p-6">
//             <h1 className="text-3xl font-bold mb-6">AI Assignment Solver</h1>

//             {!taskId ? (
//                 <UploadForm onUploadSuccess={(id: string) => setTaskId(id)} />
//             ) : (
//                 <QuestionForm taskId={taskId} />
//             )}
//         </div>
//     );
// }

// export default Home;
import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import AssignmentResults from '../components/AssignmentResults';

type Result = {
    questionNumber: number;
    questionText: string;
    answer: string;
};

const HomePage: React.FC = () => {
    const [results, setResults] = useState<Result[] | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileUpload = async (pdfFile: File) => {
        const formData = new FormData();
        formData.append('pdf', pdfFile);

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/solve-assignment', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'assignment-answers.pdf');
                document.body.appendChild(link);
                link.click();
                link.remove();

                alert('Answers PDF downloaded successfully!');
            } else {
                const error = await response.json();
                alert('Error: ' + error.error);
            }
        } catch (err) {
            alert('Server error: ' + err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Assignment Solver</h1>
            <FileUpload onUploadComplete={handleFileUpload} />
            {loading && <p className="text-center mt-4 text-blue-600 font-semibold">Processing... Please wait.</p>}
            {results && <AssignmentResults results={results} />}
        </div>
    );
};

export default HomePage;
