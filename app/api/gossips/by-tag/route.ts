import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tagName = searchParams.get("tag")

  if (!tagName) {
    return NextResponse.json({ error: "Tag parameter is required" }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const db = client.db("whisperwall")

    // Case insensitive search for tag
    const gossips = await db
      .collection("gossips")
      .find({ tags: { $regex: new RegExp(`^${tagName}$`, "i") } })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(
      gossips.map((gossip) => ({
        id: gossip._id.toString(),
        content: gossip.content,
        createdAt: gossip.createdAt.toISOString(),
        tags: gossip.tags || [],
      })),
    )
  } catch (error) {
    console.error("Failed to fetch gossips by tag:", error)
    return NextResponse.json({ error: "Failed to fetch gossips by tag" }, { status: 500 })
  }
}
