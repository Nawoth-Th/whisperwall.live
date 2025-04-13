import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"

// Simple admin auth check - in a real app, use a more secure method
const validateAdminRequest = (request: Request) => {
  const authHeader = request.headers.get("authorization")
  // Very basic auth check - replace with proper auth in production
  return authHeader === `Bearer ${process.env.ADMIN_SECRET_KEY}`
}

export async function GET(request: Request) {
  // Check if admin
  if (!validateAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const client = await clientPromise
    const db = client.db("whisperwall")

    const gossips = await db.collection("gossips").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(
      gossips.map((gossip) => ({
        id: gossip._id.toString(),
        content: gossip.content,
        createdAt: gossip.createdAt.toISOString(),
      })),
    )
  } catch (error) {
    console.error("Failed to fetch gossips:", error)
    return NextResponse.json({ error: "Failed to fetch gossips" }, { status: 500 })
  }
}
