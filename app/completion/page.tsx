"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, Clock, FlaskConical, ListChecks } from "lucide-react"

export default function CompletionPage() {
  const searchParams = useSearchParams()
  const version = searchParams.get("version")
  const timeSpent = searchParams.get("time")

  const taskTimesStr = searchParams.get("taskTimes")
  const answersStr = searchParams.get("answers")

  const taskTimes = taskTimesStr ? JSON.parse(taskTimesStr) : []
  const answers = answersStr ? JSON.parse(answersStr) : []

  const TASK_LABELS = [
    "Name & Biometric Data Collection",
    "Data Sold to Third Parties",
    "Data Deletion Rights",
    "Data Access",
    "Data Storage Duration",
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl">Account Created Successfully!</CardTitle>
          <CardDescription className="text-lg">Thank you for participating in this experiment</CardDescription>
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
                <p className="text-sm text-muted-foreground mt-1">Across all tasks</p>
              </CardContent>
            </Card>
          </div>

          {taskTimes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ListChecks className="w-5 h-5" />
                  Task Completion Times
                </CardTitle>
                <CardDescription>Time spent on each research task</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {taskTimes.map((time: number, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">Task {index + 1}</p>
                        <p className="text-xs text-muted-foreground">{TASK_LABELS[index]}</p>
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

          {answers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Participant Answers</CardTitle>
                <CardDescription>Responses to each research task</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {answers.map((answer: string, index: number) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <p className="font-medium text-sm mb-1">
                        Task {index + 1}: {TASK_LABELS[index]}
                      </p>
                      <p className="text-sm text-muted-foreground">{answer || "(No answer provided)"}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
              <li>Review answer quality and comprehension</li>
              <li>Collect post-task feedback from participant</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Test Another Version
              </Button>
            </Link>
            <Button className="flex-1" onClick={() => window.print()}>
              Print Results
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
