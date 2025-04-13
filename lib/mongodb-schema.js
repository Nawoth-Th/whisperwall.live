// This file will be used to set up your MongoDB schema and indexes

import clientPromise from "./db"

export async function setupMongoDBSchema() {
  try {
    const client = await clientPromise
    const db = client.db("whisperwall")

    // Create indexes for better query performance
    await db.collection("gossips").createIndex({ createdAt: -1 })
    await db.collection("gossips").createIndex({ tags: 1 }) // Index for tag queries

    // Create tags collection if it doesn't exist
    const collections = await db.listCollections().toArray()
    if (!collections.some((col) => col.name === "tags")) {
      await db.createCollection("tags")
      await db.collection("tags").createIndex({ name: 1 }, { unique: true })
    }

    console.log("MongoDB schema and indexes set up successfully")
    return { success: true }
  } catch (error) {
    console.error("Failed to set up MongoDB schema:", error)
    return { success: false, error }
  }
}
