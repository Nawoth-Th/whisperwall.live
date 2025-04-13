import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// In-memory store for rate limiting
// Note: This will reset when the serverless function cold starts
const ipRequestCounts = new Map<string, { count: number; timestamp: number }>()

// Rate limit configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10 // 10 requests per minute

export function middleware(request: NextRequest) {
  // Only apply rate limiting to the gossip submission endpoint
  if (request.nextUrl.pathname.startsWith("/api/gossip")) {
    const ip = request.ip ?? "unknown"
    const now = Date.now()

    // Get or initialize request data for this IP
    const requestData = ipRequestCounts.get(ip) ?? { count: 0, timestamp: now }

    // Reset count if outside the current time window
    if (now - requestData.timestamp > RATE_LIMIT_WINDOW_MS) {
      requestData.count = 0
      requestData.timestamp = now
    }

    // Increment request count
    requestData.count++
    ipRequestCounts.set(ip, requestData)

    // Check if rate limit is exceeded
    if (requestData.count > MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/api/:path*",
}
