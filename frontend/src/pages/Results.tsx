import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SolutionDisplay from '../components/SolutionDisplay';

function Results() {
    const [solution, setSolution] = useState<string>('Here will appear your solution...');
    const navigate = useNavigate();

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Assignment Solution</h1>

            <SolutionDisplay solution={solution} />

            <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => navigate('/')}
            >
                Back to Home
            </button>
        </div>
    );
}

export default Results;
