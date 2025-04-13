"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { submitGossip } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { Lock } from "lucide-react"

export default function SubmitGossip() {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: "Empty gossip",
        description: "Please write something before submitting",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await submitGossip(content)
      setContent("")
      toast({
        title: "Gossip submitted",
        description: "Your secret has been shared anonymously",
      })
    } catch (error) {
      toast({
        title: "Failed to submit",
        description: "Something went wrong. Try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-rose-400" />
          <span>Share Your Gossip</span>
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Textarea
            placeholder="What's the tea? Share your juicy gossip here..."
            className="bg-gray-900 border-gray-700 min-h-[120px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={500}
          />
          <div className="text-right mt-2 text-xs text-gray-400">{content.length}/500</div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !content.trim()} className="bg-rose-600 hover:bg-rose-700">
            {isSubmitting ? "Posting..." : "Post Anonymously"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
