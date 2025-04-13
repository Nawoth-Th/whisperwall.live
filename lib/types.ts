import type { ObjectId } from "mongodb"

export interface Gossip {
  id: string
  content: string
  createdAt: string
  tags?: string[]
}

export interface ReadGossipState {
  [gossipId: string]: boolean
}

export interface Tag {
  id: string
  name: string
  count: number
}

// MongoDB document type (for reference)
export interface GossipDocument {
  _id: string | ObjectId
  content: string
  createdAt: Date
  tags?: string[]
}
