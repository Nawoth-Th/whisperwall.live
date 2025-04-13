"use server"

import { revalidatePath } from "next/cache"
import clientPromise from "@/lib/db"
import type { Gossip, Tag } from "@/lib/types"

export async function getGossips(): Promise<Gossip[]> {
  try {
    const client = await clientPromise
    const db = client.db("whisperwall")

    const gossips = await db.collection("gossips").find({}).sort({ createdAt: -1 }).limit(100).toArray()

    return gossips.map((gossip) => ({
      id: gossip._id.toString(),
      content: gossip.content,
      createdAt: gossip.createdAt.toISOString(),
      tags: gossip.tags || [],
    }))
  } catch (error) {
    console.error("Failed to fetch gossips:", error)
    return []
  }
}

export async function getNewGossips(since: string): Promise<Gossip[]> {
  try {
    const client = await clientPromise
    const db = client.db("whisperwall")

    const sinceDate = new Date(since)

    const gossips = await db
      .collection("gossips")
      .find({ createdAt: { $gt: sinceDate } })
      .sort({ createdAt: -1 })
      .toArray()

    return gossips.map((gossip) => ({
      id: gossip._id.toString(),
      content: gossip.content,
      createdAt: gossip.createdAt.toISOString(),
      tags: gossip.tags || [],
    }))
  } catch (error) {
    console.error("Failed to fetch new gossips:", error)
    return []
  }
}

export async function submitGossip(content: string, tags: string[] = []) {
  try {
    const client = await clientPromise
    const db = client.db("whisperwall")

    // Normalize tags (trim and convert to lowercase for storage)
    const normalizedTags = tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0)

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

    revalidatePath("/")
    return { success: true, id: result.insertedId.toString() }
  } catch (error) {
    console.error("Failed to submit gossip:", error)
    return { success: false, error: "Failed to submit gossip" }
  }
}

export async function getAllTags(): Promise<Tag[]> {
  try {
    const client = await clientPromise
    const db = client.db("whisperwall")

    const tags = await db.collection("tags").find({}).sort({ count: -1 }).toArray()

    return tags.map((tag) => ({
      id: tag._id.toString(),
      name: tag.name,
      count: tag.count,
    }))
  } catch (error) {
    console.error("Failed to fetch tags:", error)
    return []
  }
}

export async function getGossipsByTag(tagName: string): Promise<Gossip[]> {
  try {
    const client = await clientPromise
    const db = client.db("whisperwall")

    // Case insensitive search for tag
    const gossips = await db
      .collection("gossips")
      .find({ tags: { $regex: new RegExp(`^${tagName}$`, "i") } })
      .sort({ createdAt: -1 })
      .toArray()

    return gossips.map((gossip) => ({
      id: gossip._id.toString(),
      content: gossip.content,
      createdAt: gossip.createdAt.toISOString(),
      tags: gossip.tags || [],
    }))
  } catch (error) {
    console.error("Failed to fetch gossips by tag:", error)
    return []
  }
}
