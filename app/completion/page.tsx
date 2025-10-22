"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, Clock, FlaskConical } from "lucide-react"

export default function CompletionPage() {
  const searchParams = useSearchParams()
  const version = searchParams.get("version")
  const timeSpent = searchParams.get("time")

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
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
                  {version === "A" ? "Control (Traditional)" : "Experimental (AI Assistant)"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time Spent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{timeSpent} seconds</p>
                <p className="text-sm text-muted-foreground mt-1">From start to completion</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Researcher Notes:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Record the time spent: {timeSpent} seconds</li>
              <li>Note user engagement with privacy policy</li>
              <li>Document any questions asked (Version B only)</li>
              <li>Observe user behavior and hesitation points</li>
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
