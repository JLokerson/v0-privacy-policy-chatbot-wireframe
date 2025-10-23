"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { privacyPolicyInstagram } from "@/lib/privacy-policy-instagram"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const TASKS = [
  {
    id: 1,
    question: "Does PhotoShare collect your name and biometric data?",
    hint: "Look in the 'Information We Collect' section",
    options: [
      "Yes, both name and biometric data",
      "Only name, not biometric data",
      "Only biometric data, not name",
      "No, neither",
    ],
  },
  {
    id: 2,
    question: "Can your data be used to improve their business?",
    hint: "Check the 'How We Use Your Information' section",
    options: [
      "Yes, explicitly stated",
      "Yes, but only with consent",
      "No, not mentioned",
      "Only for specific purposes",
    ],
  },
  {
    id: 3,
    question: "Can you delete your data?",
    hint: "Review the 'Your Choices About Your Information' section",
    options: ["Yes, completely", "Yes, but some data may remain", "No", "Only after account deletion"],
  },
  {
    id: 4,
    question: "Can your data be sent to third parties?",
    hint: "Look at the 'Sharing of Your Information' section",
    options: [
      "Yes, it can be shared with third parties",
      "No, never shared",
      "Only with explicit consent",
      "Only anonymized data",
    ],
  },
  {
    id: 5,
    question: "How long is your data stored?",
    hint: "Find information in 'How We Store Your Information'",
    options: ["Specific time period mentioned", "As long as account is active", "Indefinitely", "Varies by data type"],
  },
]

export default function VersionASignup() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    agreedToPolicy: false,
  })

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [taskStartTimes, setTaskStartTimes] = useState<number[]>([Date.now()])
  const [taskCompletionTimes, setTaskCompletionTimes] = useState<number[]>([])
  const [taskAnswers, setTaskAnswers] = useState<string[]>(Array(TASKS.length).fill(""))

  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector("[data-radix-scroll-area-viewport]")

    if (!scrollElement) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10

      if (isAtBottom && !hasScrolledToBottom) {
        setHasScrolledToBottom(true)
      }
    }

    scrollElement.addEventListener("scroll", handleScroll)
    return () => scrollElement.removeEventListener("scroll", handleScroll)
  }, [hasScrolledToBottom])

  const handleTaskComplete = () => {
    const now = Date.now()
    const newCompletionTimes = [...taskCompletionTimes, now]
    setTaskCompletionTimes(newCompletionTimes)

    if (currentTaskIndex < TASKS.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1)
      setTaskStartTimes([...taskStartTimes, now])
      setHasScrolledToBottom(false)

      // Scroll back to top for next task
      const scrollElement = scrollAreaRef.current?.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollElement) {
        scrollElement.scrollTop = 0
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const taskTimes = taskCompletionTimes.map((completionTime, index) => {
      const startTime = taskStartTimes[index]
      return Math.round((completionTime - startTime) / 1000)
    })

    const totalTime = taskTimes.reduce((sum, time) => sum + time, 0)

    router.push(
      `/completion?version=A&time=${totalTime}&taskTimes=${JSON.stringify(taskTimes)}&answers=${JSON.stringify(taskAnswers)}`,
    )
  }

  const currentTask = TASKS[currentTaskIndex]
  const isAllTasksComplete = currentTaskIndex === TASKS.length - 1 && taskCompletionTimes.length === TASKS.length
  const isFormValid =
    formData.username && formData.email && formData.password && formData.agreedToPolicy && isAllTasksComplete

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto py-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to experiment selection
        </Link>

        <div className="mb-6">
          <div className="inline-block bg-muted px-3 py-1 rounded-full text-sm font-medium mb-2">
            Version A - Control (No AI Assistant)
          </div>
          <h1 className="text-3xl font-bold">Create Your Account</h1>
          <p className="text-muted-foreground mt-2">Complete all tasks by finding answers in the privacy policy</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Task Progress Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Research Tasks</CardTitle>
              <CardDescription>
                Task {currentTaskIndex + 1} of {TASKS.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {TASKS.map((task, index) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border ${
                    index === currentTaskIndex
                      ? "border-primary bg-primary/5"
                      : index < currentTaskIndex
                        ? "border-green-500 bg-green-50"
                        : "border-muted"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {index < currentTaskIndex ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Circle
                        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${index === currentTaskIndex ? "text-primary" : "text-muted-foreground"}`}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${index === currentTaskIndex ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        Task {task.id}
                      </p>
                      <p className="text-sm mt-1">{task.question}</p>
                      {index === currentTaskIndex && (
                        <p className="text-xs text-muted-foreground mt-2 italic">{task.hint}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Signup Form */}
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-3">Account Information</h3>
                <form className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="username" className="text-xs">
                      Username
                    </Label>
                    <Input
                      id="username"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-xs">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-xs">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="h-9"
                    />
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Policy and Task Answer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Task Card */}
            <Card className="border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Current Task</CardTitle>
                    <CardDescription className="mt-1">{currentTask.question}</CardDescription>
                  </div>
                  <Badge variant="outline">Task {currentTask.id}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Select your answer:</Label>
                  <RadioGroup
                    value={taskAnswers[currentTaskIndex]}
                    onValueChange={(value) => {
                      const newAnswers = [...taskAnswers]
                      newAnswers[currentTaskIndex] = value
                      setTaskAnswers(newAnswers)
                    }}
                  >
                    {currentTask.options.map((option, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`option-${idx}`} />
                        <Label htmlFor={`option-${idx}`} className="font-normal cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {!hasScrolledToBottom && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
                    Scroll through the entire Privacy Policy below to unlock the "Complete Task" button
                  </div>
                )}

                <Button
                  onClick={handleTaskComplete}
                  disabled={!hasScrolledToBottom || !taskAnswers[currentTaskIndex]}
                  className="w-full"
                >
                  {currentTaskIndex === TASKS.length - 1 ? "Complete Final Task" : "Complete Task & Continue"}
                </Button>
              </CardContent>
            </Card>

            {/* Privacy Policy */}
            <Card>
              <CardHeader>
                <CardTitle>PhotoShare Privacy Policy</CardTitle>
                <CardDescription>
                  {hasScrolledToBottom
                    ? "You have reviewed the privacy policy for this task"
                    : "Scroll to the bottom to continue"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea ref={scrollAreaRef} className="h-[600px] w-full rounded-md border p-4">
                  <div className="prose prose-sm max-w-none">{privacyPolicyInstagram}</div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Final Agreement */}
            {isAllTasksComplete && (
              <Card className="border-green-500">
                <CardHeader>
                  <CardTitle className="text-green-700">All Tasks Complete!</CardTitle>
                  <CardDescription>Review your information and create your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreedToPolicy}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreedToPolicy: checked as boolean })}
                    />
                    <label htmlFor="terms" className="text-sm leading-none">
                      I have read and agree to the Privacy Policy
                    </label>
                  </div>

                  <Button onClick={handleSubmit} className="w-full" disabled={!isFormValid} size="lg">
                    Create Account
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
