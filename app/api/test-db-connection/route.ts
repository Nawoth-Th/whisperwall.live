import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"

export async function GET() {
  try {
    // Test MongoDB connection
    const client = await clientPromise
    const db = client.db("whisperwall")

    // Try to get a list of collections to verify connection
    const collections = await db.listCollections().toArray()

    // Create gossips collection if it doesn't exist
    if (!collections.some((col) => col.name === "gossips")) {
      await db.createCollection("gossips")
      await db.collection("gossips").createIndex({ createdAt: -1 })
    }

    return NextResponse.json({
      success: true,
      message: "Successfully connected to MongoDB",
      database: "whisperwall",
      collections: collections.map((col) => col.name),
    })
  } catch (error) {
    console.error("Database connection test failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to database",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
