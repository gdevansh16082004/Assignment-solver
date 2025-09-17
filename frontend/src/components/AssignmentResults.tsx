type Result = {
    questionNumber: number;
    questionText: string;
    answer: string;
};

type AssignmentResultsProps = {
    results: Result[];
};

const AssignmentResults: React.FC<AssignmentResultsProps> = ({ results }) => {
    return (
        <div className="mt-6 p-4 bg-white rounded shadow-md">
            <h2 className="text-xl font-semibold text-center mb-4">Solved Assignment</h2>
            {results.map(({ questionNumber, questionText, answer }) => (
                <div key={questionNumber} className="mb-6 border-b pb-4">
                    <h3 className="text-lg font-semibold">Question {questionNumber}</h3>
                    <p className="mt-2 text-gray-700"><span className="font-medium">Q:</span> {questionText}</p>
                    <p className="mt-2 text-gray-700"><span className="font-medium">A:</span> {answer}</p>
                </div>
            ))}
        </div>
    );
};

export default AssignmentResults;
