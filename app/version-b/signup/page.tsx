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
import { privacyPolicyTikTok } from "@/lib/privacy-policy-tiktok"
import { useRouter } from "next/navigation"
import { ArrowLeft, MessageCircle, X, Send, CheckCircle2, Circle } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const TASKS = [
  {
    id: 1,
    question: "Does PhotoShare collect your name and biometric data?",
    hint: "Try asking the AI assistant about data collection",
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
    hint: "Ask the AI about business use of data",
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
    hint: "Ask about data deletion rights",
    options: ["Yes, completely", "Yes, but some data may remain", "No", "Only after account deletion"],
  },
  {
    id: 4,
    question: "Can your data be sent to third parties?",
    hint: "Ask about data sharing with third parties",
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
    hint: "Ask about data retention periods",
    options: ["Specific time period mentioned", "As long as account is active", "Indefinitely", "Varies by data type"],
  },
]

export default function VersionBSignup() {
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

  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [inputMessage, setInputMessage] = useState("")
  const chatScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages([])
  }, [currentTaskIndex])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    setMessages([...messages, { role: "user", content: inputMessage }])
    setInputMessage("")
  }

  const handleTaskComplete = () => {
    const now = Date.now()
    const newCompletionTimes = [...taskCompletionTimes, now]
    setTaskCompletionTimes(newCompletionTimes)

    if (currentTaskIndex < TASKS.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1)
      setTaskStartTimes([...taskStartTimes, now])
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
      `/completion?version=B&time=${totalTime}&taskTimes=${JSON.stringify(taskTimes)}&answers=${JSON.stringify(taskAnswers)}`,
    )
  }

  const suggestedQuestions = [
    "What personal information does PhotoShare collect?",
    "Does PhotoShare collect biometric data?",
    "Can my data be used to improve their business?",
    "Can I delete my data?",
    "Can my data be sent to third parties?",
    "How long is my data stored?",
  ]

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
          <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
            Version B - Experimental (AI Assistant)
          </div>
          <h1 className="text-3xl font-bold">Create Your Account</h1>
          <p className="text-muted-foreground mt-2">Complete all tasks using the privacy policy and AI assistant</p>
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

                <Button onClick={handleTaskComplete} disabled={!taskAnswers[currentTaskIndex]} className="w-full">
                  {currentTaskIndex === TASKS.length - 1 ? "Complete Final Task" : "Complete Task & Continue"}
                </Button>
              </CardContent>
            </Card>

            {/* Privacy Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  PhotoShare Privacy Policy
                  <Badge variant="secondary" className="gap-1">
                    <MessageCircle className="w-3 h-3" />
                    AI Assistant Available
                  </Badge>
                </CardTitle>
                <CardDescription>Review the policy or ask the AI assistant for help</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                  <div className="prose prose-sm max-w-none">{privacyPolicyTikTok}</div>
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

      {/* AI Chatbot Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:scale-110 transition-transform z-50"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* AI Chatbot Window */}
      {chatOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl flex flex-col z-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg">Privacy Policy Assistant</CardTitle>
              <CardDescription className="text-xs">Ask me about the privacy policy</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setChatOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <ScrollArea ref={chatScrollRef} className="flex-1 p-4">
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">
                      👋 Hi! I'm here to help you understand PhotoShare's privacy policy. You can ask me questions or
                      try one of these:
                    </p>
                  </div>
                  <div className="space-y-2">
                    {suggestedQuestions.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setMessages([{ role: "user", content: question }])
                        }}
                        className="w-full text-left text-sm p-2 rounded-md border hover:bg-muted transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg ${
                        msg.role === "user" ? "bg-primary text-primary-foreground ml-8" : "bg-muted mr-8"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  ))}
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      <strong>Researcher Note:</strong> Respond as the AI assistant based on the privacy policy content
                    </p>
                  </div>
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about the privacy policy..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
