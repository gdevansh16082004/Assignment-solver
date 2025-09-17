import { useState } from 'react';
import axios from 'axios';

interface QuestionFormProps {
    taskId: string;
}

function QuestionForm({ taskId }: QuestionFormProps) {
    const [question, setQuestion] = useState('');
    const [solution, setSolution] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);

        const res = await axios.post(
            `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/query-solution`,
            { taskId, question }
        );

        setSolution(res.data.solution);
        setLoading(false);
    };

    return (
        <div className="max-w-xl mx-auto p-4">
            <textarea
                className="w-full p-2 border rounded mb-4"
                placeholder="Type your assignment question here"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />

            <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? 'Generating Solution...' : 'Get Solution'}
            </button>

            {solution && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                    <h3 className="font-semibold">Generated Solution:</h3>
                    <pre className="whitespace-pre-wrap">{solution}</pre>
                </div>
            )}
        </div>
    );
}

export default QuestionForm;
