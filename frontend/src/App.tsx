import { FileUpload } from "./components/FileUpload"
import { ProgressStepper } from "./components/ProgressStepper"
import { useAssignmentSolver } from "./hooks/useAssignmentSolver"

export default function App() {
  const { file, setFile, submitAssignment, status, progress, resultUrl, error } = useAssignmentSolver()
  const isLoading = status === "uploading" || status === "processing"

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20 font-sans flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-3xl bg-card/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/50 p-8 transition-all duration-500 hover:shadow-3xl">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Academic Assistant Agent
            </h1>
          </div>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Upload your assignment (PDF, DOCX) and let our AI agent analyze, solve, and format it for you with
            intelligent reasoning and planning.
          </p>
        </header>

        {status === "idle" || status === "uploading" ? (
          <FileUpload file={file} setFile={setFile} onSubmit={submitAssignment} isLoading={isLoading} />
        ) : (
          <ProgressStepper status={status} progress={progress} resultUrl={resultUrl} error={error} />
        )}
      </main>
    </div>
  )
}

