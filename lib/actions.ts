"use server"

import { revalidatePath } from "next/cache"
import clientPromise from "@/lib/db"
import type { Gossip } from "@/lib/types"

export async function getGossips(): Promise<Gossip[]> {
  try {
    const client = await clientPromise
    const db = client.db("whisperwall")

    const gossips = await db.collection("gossips").find({}).sort({ createdAt: -1 }).limit(100).toArray()

    return gossips.map((gossip) => ({
      id: gossip._id.toString(),
      content: gossip.content,
      createdAt: gossip.createdAt.toISOString(),
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
    }))
  } catch (error) {
    console.error("Failed to fetch new gossips:", error)
    return []
  }
}

export async function submitGossip(content: string) {
  try {
    const client = await clientPromise
    const db = client.db("whisperwall")

    const result = await db.collection("gossips").insertOne({
      content,
      createdAt: new Date(),
    })

    revalidatePath("/")
    return { success: true, id: result.insertedId.toString() }
  } catch (error) {
    console.error("Failed to submit gossip:", error)
    return { success: false, error: "Failed to submit gossip" }
  }
}
