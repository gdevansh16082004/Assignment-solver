interface SolutionDisplayProps {
    solution: string;
}

function SolutionDisplay({ solution }: SolutionDisplayProps) {
    return (
        <div className="p-4 bg-gray-100 rounded my-4">
            <h3 className="text-lg font-medium">Solution:</h3>
            <pre className="whitespace-pre-wrap">{solution}</pre>
        </div>
    );
}

export default SolutionDisplay;
