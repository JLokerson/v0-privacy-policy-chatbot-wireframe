"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { privacyPolicyText } from "@/lib/privacy-policy"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function VersionASignup() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    agreedToPolicy: false,
  })
  const [startTime] = useState(Date.now())
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    router.push(`/completion?version=A&time=${timeSpent}`)
  }

  const isFormValid =
    formData.username && formData.email && formData.password && formData.agreedToPolicy && hasScrolledToBottom

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto py-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to experiment selection
        </Link>

        <div className="mb-6">
          <div className="inline-block bg-muted px-3 py-1 rounded-full text-sm font-medium mb-2">
            Version A - Control
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

          {/* Privacy Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
              <CardDescription>
                {hasScrolledToBottom ? "You have reviewed the privacy policy" : "Scroll to the bottom to continue"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea ref={scrollAreaRef} className="h-[500px] w-full rounded-md border p-4">
                <div className="prose prose-sm max-w-none">{privacyPolicyText}</div>
              </ScrollArea>

              <div className="mt-6 space-y-4">
                {!hasScrolledToBottom && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
                    Please scroll through the entire Privacy Policy to continue
                  </div>
                )}

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreedToPolicy}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreedToPolicy: checked as boolean })}
                    disabled={!hasScrolledToBottom}
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
    </div>
  )
}
