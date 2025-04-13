import GossipFeed from "@/components/gossip-feed"
import SubmitGossip from "@/components/submit-gossip"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
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
      </div>
    </main>
  )
}
