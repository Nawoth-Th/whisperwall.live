// This file will be used to set up your MongoDB schema and indexes

import clientPromise from "./db"

export async function setupMongoDBSchema() {
  try {
    const client = await clientPromise
    const db = client.db("whisperwall")

    // Create indexes for better query performance
    await db.collection("gossips").createIndex({ createdAt: -1 })

    console.log("MongoDB schema and indexes set up successfully")
    return { success: true }
  } catch (error) {
    console.error("Failed to set up MongoDB schema:", error)
    return { success: false, error }
  }
}
