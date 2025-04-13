"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Trash2 } from "lucide-react"
import type { Gossip } from "@/lib/types"

export default function AdminPage() {
  const [gossips, setGossips] = useState<Gossip[]>([])
  const [loading, setLoading] = useState(true)
  const [adminKey, setAdminKey] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const { toast } = useToast()

  async function loadGossips() {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/gossips", {
        headers: {
          Authorization: `Bearer ${adminKey}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to load gossips")
      }

      const data = await response.json()
      setGossips(data)
      setAuthenticated(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load gossips. Check your admin key.",
        variant: "destructive",
      })
      setAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  async function deleteGossip(id: string) {
    try {
      const response = await fetch("/api/admin/delete-gossip", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminKey}`,
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete gossip")
      }

      // Remove the deleted gossip from the state
      setGossips((prevGossips) => prevGossips.filter((gossip) => gossip.id !== id))

      toast({
        title: "Success",
        description: "Gossip deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete gossip",
        variant: "destructive",
      })
    }
  }

  function handleAuthenticate(e: React.FormEvent) {
    e.preventDefault()
    loadGossips()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-rose-500">Whisper Wall Admin</h1>
          <p className="text-gray-400">Manage gossips and moderate content</p>
        </header>

        {!authenticated ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Admin Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuthenticate} className="space-y-4">
                <div>
                  <label htmlFor="adminKey" className="block text-sm font-medium mb-1">
                    Admin Key
                  </label>
                  <Input
                    id="adminKey"
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    className="bg-gray-900 border-gray-700"
                    placeholder="Enter your admin key"
                  />
                </div>
                <Button type="submit" className="bg-rose-600 hover:bg-rose-700">
                  Authenticate
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Manage Gossips</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-10">
                    <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading gossips...</p>
                  </div>
                ) : gossips.length === 0 ? (
                  <p className="text-center text-gray-400">No gossips found</p>
                ) : (
                  <div className="space-y-4">
                    {gossips.map((gossip) => (
                      <div key={gossip.id} className="p-4 bg-gray-900 rounded-lg flex justify-between items-start">
                        <div>
                          <p className="whitespace-pre-wrap mb-2">{gossip.content}</p>
                          <p className="text-xs text-gray-400">{new Date(gossip.createdAt).toLocaleString()}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteGossip(gossip.id)}
                          className="ml-4"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
