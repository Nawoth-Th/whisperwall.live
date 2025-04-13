import GossipFeed from "@/components/gossip-feed"
import SubmitGossip from "@/components/submit-gossip"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8 overflow-x-hidden">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-rose-500">Whisper Wall</h1>
          <p className="text-gray-400">Share your secrets anonymously. No names, no traces.</p>
        </header>

        <div className="max-w-2xl mx-auto">
          <SubmitGossip />
          <div className="mt-10">
            <GossipFeed />
          </div>
        </div>

        <footer className="mt-16 py-6 border-t border-gray-800 text-center text-gray-400 px-4">
          <p>
            Inspired from{" "}
            <Link
              href="https://www.tiktok.com/@rizzcado?_t=ZS-8vUXkY2BE9Q&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-400 hover:text-rose-300 transition-colors"
            >
              Kalathma H
            </Link>
          </p>
        </footer>
      </div>
    </main>
  )
}
