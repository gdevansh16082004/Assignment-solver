import type React from "react"
import { CheckCircle, Loader2, Download, AlertTriangle, FileSearch, Brain, FileOutput, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

type JobStatus = "idle" | "uploading" | "processing" | "completed" | "failed"

interface ProgressStepperProps {
  status: JobStatus
  progress: number
  resultUrl: string | null
  error: string | null
}

const steps = [
  {
    name: "Extracting Questions",
    progress: 25,
    icon: FileSearch,
    description: "Analyzing document structure and identifying questions",
  },
  {
    name: "Solving Questions",
    progress: 60,
    icon: Brain,
    description: "AI agent reasoning through problems and generating solutions",
  },
  {
    name: "Generating PDF",
    progress: 90,
    icon: FileOutput,
    description: "Formatting answers and creating final document",
  },
  {
    name: "Completed",
    progress: 100,
    icon: CheckSquare,
    description: "Assignment ready for download",
  },
]

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ status, progress, resultUrl, error }) => {
  if (status === "idle" || status === "uploading") return null

  const getStepStatus = (stepProgress: number, stepIndex: number) => {
    if (status === "failed" && progress < stepProgress) return "failed"
    if (status === "completed") return "completed"
    if (progress >= stepProgress) return "completed"
    if (progress >= (steps[stepIndex - 1]?.progress || 0)) {
      return "in_progress"
    }
    return "pending"
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">AI Agent Processing</h2>
        <p className="text-muted-foreground">Watch as our AI agent works through your assignment</p>
      </div>

      <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 space-y-6">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(step.progress, index)
          const StepIcon = step.icon

          return (
            <div key={step.name} className="flex items-start gap-4 group">
              <div className="flex-shrink-0 relative">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    stepStatus === "completed"
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/25"
                      : stepStatus === "in_progress"
                        ? "bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25 animate-pulse"
                        : stepStatus === "failed"
                          ? "bg-gradient-to-br from-destructive to-red-600 shadow-lg shadow-destructive/25"
                          : "bg-muted border-2 border-border"
                  }`}
                >
                  {stepStatus === "completed" && <CheckCircle className="w-6 h-6 text-white" />}
                  {stepStatus === "in_progress" && <Loader2 className="w-6 h-6 text-white animate-spin" />}
                  {stepStatus === "failed" && <AlertTriangle className="w-6 h-6 text-white" />}
                  {stepStatus === "pending" && <StepIcon className="w-6 h-6 text-muted-foreground" />}
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-12 left-1/2 w-0.5 h-8 -translate-x-1/2 transition-colors duration-300 ${
                      stepStatus === "completed" ? "bg-green-500" : "bg-border"
                    }`}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0 pt-2">
                <h3
                  className={`font-semibold transition-colors duration-300 ${
                    stepStatus === "pending" ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {step.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {status === "completed" && (
        <div className="text-center space-y-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl border border-green-200 dark:border-green-800">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-green-500/25">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-green-700 dark:text-green-300">Success! Your assignment is ready</h3>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <a href={resultUrl!} download="solved-assignment.pdf" className="inline-flex items-center gap-2 px-8 py-3">
              <Download className="w-5 h-5" />
              Download Solved Assignment
            </a>
          </Button>
        </div>
      )}

      {status === "failed" && (
        <div className="text-center space-y-4 p-6 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 rounded-2xl border border-red-200 dark:border-red-800">
          <div className="w-16 h-16 bg-gradient-to-br from-destructive to-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-destructive/25">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-red-700 dark:text-red-300">Processing Failed</h3>
            <p className="text-red-600 dark:text-red-400 text-sm">
              {error || "An unexpected error occurred while processing your assignment"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
