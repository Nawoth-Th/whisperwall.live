import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import { ObjectId } from "mongodb"

// Simple admin auth check - in a real app, use a more secure method
const validateAdminRequest = (request: Request) => {
  const authHeader = request.headers.get("authorization")
  // Very basic auth check - replace with proper auth in production
  return authHeader === `Bearer ${process.env.ADMIN_SECRET_KEY}`
}

export async function DELETE(request: Request) {
  // Check if admin
  if (!validateAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Gossip ID is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("whisperwall")

    // Delete the gossip
    const result = await db.collection("gossips").deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Gossip not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Gossip deleted successfully" })
  } catch (error) {
    console.error("Failed to delete gossip:", error)
    return NextResponse.json({ error: "Failed to delete gossip" }, { status: 500 })
  }
}
