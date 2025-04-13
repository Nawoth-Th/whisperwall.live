"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus, TagIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getAllTags } from "@/lib/actions"
import type { Tag } from "@/lib/types"

interface TagSelectorProps {
  selectedTags: string[]
  onChange: (tags: string[]) => void
}

export default function TagSelector({ selectedTags, onChange }: TagSelectorProps) {
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [newTagName, setNewTagName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadTags() {
      try {
        const tags = await getAllTags()
        setAvailableTags(tags)
      } catch (error) {
        console.error("Failed to load tags:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTags()
  }, [])

  const handleAddTag = () => {
    if (!newTagName.trim()) return

    // Check if tag already exists (case insensitive)
    const normalizedNewTag = newTagName.trim().toLowerCase()
    const existingTag = availableTags.find((tag) => tag.name.toLowerCase() === normalizedNewTag)

    if (existingTag) {
      // If tag exists but not in selected tags, add it
      if (!selectedTags.includes(existingTag.name)) {
        onChange([...selectedTags, existingTag.name])
        setNewTagName("")
      } else {
        toast({
          title: "Tag already added",
          description: `The tag "${existingTag.name}" is already added to this gossip.`,
          variant: "destructive",
        })
      }
    } else {
      // Add new tag
      const newTag = newTagName.trim()
      onChange([...selectedTags, newTag])
      setAvailableTags([...availableTags, { id: Date.now().toString(), name: newTag, count: 0 }])
      setNewTagName("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(selectedTags.filter((tag) => tag !== tagToRemove))
  }

  const handleSelectExistingTag = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      onChange([...selectedTags, tagName])
    } else {
      toast({
        title: "Tag already added",
        description: `The tag "${tagName}" is already added to this gossip.`,
      })
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 min-h-[36px]">
        {selectedTags.length > 0 ? (
          selectedTags.map((tag) => (
            <Badge key={tag} className="bg-rose-600 hover:bg-rose-700 flex items-center gap-1 px-3 py-1">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 rounded-full hover:bg-rose-800 p-0.5"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {tag} tag</span>
              </button>
            </Badge>
          ))
        ) : (
          <p className="text-xs text-gray-400">No tags selected. Add tags to categorize your gossip.</p>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Add a tag..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddTag()
              }
            }}
          />
        </div>
        <Button
          type="button"
          size="sm"
          onClick={handleAddTag}
          disabled={!newTagName.trim()}
          className="bg-rose-600 hover:bg-rose-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {!isLoading && availableTags.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-2">Popular tags:</p>
          <div className="flex flex-wrap gap-2">
            {availableTags
              .sort((a, b) => b.count - a.count)
              .slice(0, 10)
              .map((tag) => (
                <Badge
                  key={tag.id}
                  className="bg-gray-700 hover:bg-gray-600 cursor-pointer"
                  onClick={() => handleSelectExistingTag(tag.name)}
                >
                  {tag.name} ({tag.count})
                </Badge>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
