import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function POST(request: Request) {
  try {
    const { content } = await request.json()

    // Validate input
    if (!content || typeof content !== "string" || content.length > 500) {
      return NextResponse.json(
        { error: "Invalid content. Must be a string with max length of 500 characters." },
        { status: 400 },
      )
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("whisperwall")

    // Insert the gossip
    const result = await db.collection("gossips").insertOne({
      content,
      createdAt: new Date(),
    })

    // Revalidate the home page
    revalidatePath("/")

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Failed to submit gossip:", error)
    return NextResponse.json({ error: "Failed to submit gossip" }, { status: 500 })
  }
}
