"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { privacyPolicyText } from "@/lib/privacy-policy"
import { useRouter } from "next/navigation"
import { ArrowLeft, MessageCircle, X, Send } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function VersionBSignup() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    agreedToPolicy: false,
  })
  const [startTime] = useState(Date.now())
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [inputMessage, setInputMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    router.push(`/completion?version=B&time=${timeSpent}`)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    setMessages([...messages, { role: "user", content: inputMessage }])
    setInputMessage("")

    // In real experiment, researcher will respond
    // This is just a placeholder
  }

  const suggestedQuestions = [
    "What information does TikTok collect?",
    "How is my data used?",
    "Can I delete my data?",
    "Who has access to my information?",
    "How long is my data stored?",
  ]

  const isFormValid = formData.username && formData.email && formData.password && formData.agreedToPolicy

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto py-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to experiment selection
        </Link>

        <div className="mb-6">
          <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
            Version B - Experimental (AI Assistant)
          </div>
          <h1 className="text-3xl font-bold">Create Your Account</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Signup Form */}
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Enter your information to create an account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Privacy Policy with AI Assistant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Privacy Policy
                <Badge variant="secondary" className="gap-1">
                  <MessageCircle className="w-3 h-3" />
                  AI Assistant Available
                </Badge>
              </CardTitle>
              <CardDescription>Review our privacy policy or ask the AI assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                <div className="prose prose-sm max-w-none">{privacyPolicyText}</div>
              </ScrollArea>

              <div className="mt-6 space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreedToPolicy}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreedToPolicy: checked as boolean })}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I have read and agree to the Privacy Policy
                  </label>
                </div>

                <Button onClick={handleSubmit} className="w-full" disabled={!isFormValid}>
                  Create Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Chatbot Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* AI Chatbot Window */}
      {chatOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg">Privacy Policy Assistant</CardTitle>
              <CardDescription className="text-xs">Ask me anything about the privacy policy</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setChatOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">
                      👋 Hi! I'm here to help you understand TikTok's privacy policy. You can ask me questions or try
                      one of these:
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
