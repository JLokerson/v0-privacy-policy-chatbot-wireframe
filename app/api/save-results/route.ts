import { type NextRequest, NextResponse } from "next/server"
import { writeFile, readFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "experiment-data")
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }

    // Path to the results file
    const filePath = path.join(dataDir, "results.json")

    // Read existing data or create new array
    let existingData = []
    if (existsSync(filePath)) {
      const fileContent = await readFile(filePath, "utf-8")
      existingData = JSON.parse(fileContent)
    }

    // Add new result with timestamp
    const newResult = {
      ...data,
      timestamp: new Date().toISOString(),
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }

    existingData.push(newResult)

    // Write back to file
    await writeFile(filePath, JSON.stringify(existingData, null, 2))

    return NextResponse.json({
      success: true,
      message: "Results saved successfully",
      id: newResult.id,
    })
  } catch (error) {
    console.error("Error saving results:", error)
    return NextResponse.json({ success: false, error: "Failed to save results" }, { status: 500 })
  }
}
