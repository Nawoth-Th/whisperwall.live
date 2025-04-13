import type { ObjectId } from "mongodb"

export interface Gossip {
  id: string
  content: string
  createdAt: string
}

export interface ReadGossipState {
  [gossipId: string]: boolean
}

// MongoDB document type (for reference)
export interface GossipDocument {
  _id: string | ObjectId
  content: string
  createdAt: Date
}
