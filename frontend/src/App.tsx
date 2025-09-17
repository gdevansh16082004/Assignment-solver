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
            <h1 className="text-5xl font-bold bg-green-600 from-foreground via-primary to-accent bg-clip-text text-transparent">
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

