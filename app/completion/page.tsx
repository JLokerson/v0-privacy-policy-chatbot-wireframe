"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, Clock, FlaskConical, Download } from "lucide-react"

export default function CompletionPage() {
  const searchParams = useSearchParams()
  const version = searchParams.get("version")
  const timeSpent = searchParams.get("time")

  const taskTimesStr = searchParams.get("taskTimes")
  const taskTimes = taskTimesStr ? JSON.parse(taskTimesStr) : []

  const TASK_LABELS = [
    "Data Collection",
    "Business Use of Data",
    "Data Deletion Rights",
    "Third-Party Data Sharing",
    "Data Storage Duration",
  ]

  const downloadCSV = () => {
    const timestamp = new Date().toISOString()
    const csvContent = [
      [
        "Timestamp",
        "Version",
        "Total Time (s)",
        "Task 1 (s)",
        "Task 2 (s)",
        "Task 3 (s)",
        "Task 4 (s)",
        "Task 5 (s)",
        "Avg Time Per Task (s)",
      ],
      [
        timestamp,
        version || "",
        timeSpent || "",
        ...taskTimes.map((t: number) => t.toString()),
        taskTimes.length > 0 ? Math.round(Number(timeSpent) / taskTimes.length).toString() : "0",
      ],
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `privacy-policy-experiment-${version}-${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl">Experiment Complete!</CardTitle>
          <CardDescription className="text-lg">
            Please proceed to the external quiz to test your understanding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FlaskConical className="w-4 h-4" />
                  Version Tested
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">Version {version}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {version === "A" ? "Control (No AI Assistant)" : "Experimental (AI Assistant)"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Total Time Spent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{timeSpent} seconds</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Avg: {taskTimes.length > 0 ? Math.round(Number(timeSpent) / taskTimes.length) : 0}s per task
                </p>
              </CardContent>
            </Card>
          </div>

          {taskTimes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Task Completion Times
                </CardTitle>
                <CardDescription>Time spent on each section of the privacy policy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {taskTimes.map((time: number, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Task {index + 1}</p>
                          <p className="text-xs text-muted-foreground">{TASK_LABELS[index]}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{time}s</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Button onClick={downloadCSV} className="w-full" size="lg">
            <Download className="w-4 h-4 mr-2" />
            Download Timing Data (CSV)
          </Button>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-900">Next Step: External Quiz</h3>
            <p className="text-sm text-blue-800">
              Participants will now be directed to an external quiz to assess their understanding of the privacy policy
              content.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Researcher Notes:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>
                Total time: {timeSpent} seconds across {taskTimes.length} tasks
              </li>
              <li>
                Average time per task: {taskTimes.length > 0 ? Math.round(Number(timeSpent) / taskTimes.length) : 0}s
              </li>
              <li>Note user engagement patterns with privacy policy</li>
              {version === "B" && <li>Document AI assistant interactions and questions asked</li>}
              {version === "A" && <li>Observe scrolling behavior and reading patterns</li>}
              <li>Compare timing data with quiz results from external assessment</li>
              <li>Collect post-task feedback from participant</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Test Another Version
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
