import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function POST(request: Request) {
  try {
    const { content, tags } = await request.json()

    // Validate input
    if (!content || typeof content !== "string" || content.length > 500) {
      return NextResponse.json(
        { error: "Invalid content. Must be a string with max length of 500 characters." },
        { status: 400 },
      )
    }

    // Validate tags
    if (tags && (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string"))) {
      return NextResponse.json({ error: "Tags must be an array of strings." }, { status: 400 })
    }

    // Normalize tags (trim and convert to lowercase for storage)
    const normalizedTags = tags ? tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0) : []

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("whisperwall")

    // Insert the gossip with tags
    const result = await db.collection("gossips").insertOne({
      content,
      createdAt: new Date(),
      tags: normalizedTags,
    })

    // Update tag counts in the tags collection
    if (normalizedTags.length > 0) {
      const tagOperations = normalizedTags.map((tagName) => {
        return {
          updateOne: {
            filter: { name: { $regex: new RegExp(`^${tagName}$`, "i") } },
            update: { $inc: { count: 1 }, $setOnInsert: { name: tagName } },
            upsert: true,
          },
        }
      })

      await db.collection("tags").bulkWrite(tagOperations)
    }

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
