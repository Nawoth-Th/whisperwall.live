import { NextResponse } from "next/server"
import { setupMongoDBSchema } from "@/lib/mongodb-schema"

export async function GET() {
  try {
    const result = await setupMongoDBSchema()

    if (result.success) {
      return NextResponse.json({ message: "Database initialized successfully" })
    } else {
      return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
