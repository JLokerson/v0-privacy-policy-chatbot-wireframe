import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-3xl">Privacy Policy Retention Experiment</CardTitle>
          <CardDescription className="text-lg">Select a version to test the account creation flow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Version A (Control)</CardTitle>
                <CardDescription>Traditional account creation with standard privacy policy display</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/version-a/signup">
                  <Button className="w-full bg-transparent" variant="outline">
                    Test Version A
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle>Version B (Experimental)</CardTitle>
                <CardDescription>
                  Account creation with AI chatbot assistant to help understand privacy policy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/version-b/signup">
                  <Button className="w-full">Test Version B</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Experiment Instructions:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>
                Each version uses a different privacy policy (Version A: Meta/Instagram policy, Version B: TikTok
                policy)
              </li>
              <li>Version A: Traditional scrollable policy text without assistance</li>
              <li>Version B: AI chatbot assistant to help understand the policy</li>
              <li>Complete 5 tasks by reading the policy and clicking "Next" when you understand each section</li>
              <li>Track time spent on each task for analysis</li>
              <li>Note: In Version B, a researcher will act as the chatbot</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
