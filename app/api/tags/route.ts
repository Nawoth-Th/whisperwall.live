import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("whisperwall")

    const tags = await db.collection("tags").find({}).sort({ count: -1 }).toArray()

    return NextResponse.json(
      tags.map((tag) => ({
        id: tag._id.toString(),
        name: tag.name,
        count: tag.count,
      })),
    )
  } catch (error) {
    console.error("Failed to fetch tags:", error)
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
  }
}
