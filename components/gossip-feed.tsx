"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { getGossips, getNewGossips } from "@/lib/actions"
import type { Gossip, ReadGossipState } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { RefreshCcw, CheckCircle, Circle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function GossipFeed() {
  const [gossips, setGossips] = useState<Gossip[]>([])
  const [filteredGossips, setFilteredGossips] = useState<Gossip[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingNew, setLoadingNew] = useState(false)
  const [readGossips, setReadGossips] = useState<ReadGossipState>({})
  const [lastLoadTime, setLastLoadTime] = useState<Date>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  // Load read gossips from localStorage on initial render
  useEffect(() => {
    const savedReadGossips = localStorage.getItem("readGossips")
    if (savedReadGossips) {
      try {
        setReadGossips(JSON.parse(savedReadGossips))
      } catch (e) {
        console.error("Failed to parse saved read gossips", e)
      }
    }
  }, [])

  // Save read gossips to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("readGossips", JSON.stringify(readGossips))
  }, [readGossips])

  // Filter gossips whenever search query or gossips change
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredGossips(gossips)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = gossips.filter((gossip) => gossip.content.toLowerCase().includes(query))
    setFilteredGossips(filtered)
  }, [searchQuery, gossips])

  async function loadGossips() {
    setLoading(true)
    try {
      const data = await getGossips()
      setGossips(data)
      setFilteredGossips(data)
      setLastLoadTime(new Date())
    } catch (error) {
      console.error("Failed to load gossips", error)
    } finally {
      setLoading(false)
    }
  }

  async function loadNewGossips() {
    setLoadingNew(true)
    try {
      const data = await getNewGossips(lastLoadTime.toISOString())
      if (data.length > 0) {
        setGossips((prevGossips) => [...data, ...prevGossips])
        setLastLoadTime(new Date())
        toast({
          title: `${data.length} new gossip${data.length > 1 ? "s" : ""} loaded`,
          description: "Check out the latest tea!",
        })
      } else {
        toast({
          title: "No new gossip",
          description: "Check back later for more tea",
        })
      }
    } catch (error) {
      console.error("Failed to load new gossips", error)
      toast({
        title: "Failed to load new gossip",
        description: "Something went wrong. Try again later.",
        variant: "destructive",
      })
    } finally {
      setLoadingNew(false)
    }
  }

  function markAsRead(gossipId: string) {
    setReadGossips((prev) => ({
      ...prev,
      [gossipId]: true,
    }))
  }

  function toggleReadStatus(gossipId: string) {
    setReadGossips((prev) => ({
      ...prev,
      [gossipId]: !prev[gossipId],
    }))
  }

  useEffect(() => {
    loadGossips()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-400">Loading the latest gossip...</p>
      </div>
    )
  }

  const unreadCount = filteredGossips.filter((gossip) => !readGossips[gossip.id]).length

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Latest Gossip</h2>
          {unreadCount > 0 && <Badge className="bg-rose-600">{unreadCount} unread</Badge>}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search gossips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 w-full"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadNewGossips}
            disabled={loadingNew}
            className="text-gray-400 hover:text-white"
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${loadingNew ? "animate-spin" : ""}`} />
            {loadingNew ? "Loading..." : "New Gossip"}
          </Button>
          <Button variant="ghost" size="sm" onClick={loadGossips} className="text-gray-400 hover:text-white">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
        </div>
      </div>

      {filteredGossips.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-10">
            {searchQuery ? (
              <p className="text-gray-400">No gossips match your search.</p>
            ) : (
              <p className="text-gray-400">No gossip yet. Be the first to share!</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredGossips.map((gossip) => {
            const isRead = readGossips[gossip.id] || false

            return (
              <Card
                key={gossip.id}
                className={`bg-gray-800 border-gray-700 transition-all ${isRead ? "opacity-70" : ""}`}
                onMouseEnter={() => !isRead && markAsRead(gossip.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    {!isRead && <Badge className="bg-rose-600 mb-2">New</Badge>}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto -mt-2 -mr-2 text-gray-400 hover:text-white"
                      onClick={() => toggleReadStatus(gossip.id)}
                    >
                      {isRead ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="whitespace-pre-wrap">{gossip.content}</p>
                </CardContent>
                <CardFooter className="text-xs text-gray-400 justify-between border-t border-gray-700 mt-4">
                  <span>Anonymous</span>
                  <span>{formatDistanceToNow(new Date(gossip.createdAt), { addSuffix: true })}</span>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
