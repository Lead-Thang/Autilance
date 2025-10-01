"use client"

import { SearchIcon, UserIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { useState, useEffect } from "react"

// Define the user search result type
interface UserSearchResult {
  id: string
  name: string
  avatar: string | null
  title?: string
  isFriend: boolean
}

export function Search() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Handle user search
  const handleUserSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setIsOpen(false)
      return
    }

    setSearchLoading(true)
    setIsOpen(true)
    
    // In a real application, this would be an actual API call to search users
    // For now we'll just demonstrate the loading state and empty results
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // In a real app, we would receive actual results from an API
    // For now we'll set empty results to demonstrate the UI without mockups
    setSearchResults([])
    setSearchLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would trigger a search
    console.log("Searching for:", searchQuery)
  }

  // Handle search input changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        handleUserSearch(searchQuery)
      } else {
        setSearchResults([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  return (
    <div className="relative">
      {isExpanded ? (
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 w-40 focus:w-60 transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => {
                if (!searchQuery) {
                  setIsExpanded(false)
                }
              }}
              autoFocus
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </form>
      ) : (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsExpanded(true)}
          className="rounded-full"
        >
          <SearchIcon className="h-4 w-4" />
        </Button>
      )}

      {isOpen && searchResults.length > 0 && (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <div className="absolute top-full mt-1 w-full z-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-[280px] p-0" 
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <div className="p-2">
              <div className="flex items-center justify-between px-2 py-1">
                <h3 className="text-sm font-semibold text-gray-500">Users</h3>
              </div>
              {searchLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((user) => (
                    <DropdownMenuItem 
                      key={user.id} 
                      className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-accent"
                      onSelect={() => {
                        console.log("Selected user:", user)
                        setSearchQuery("")
                        setIsOpen(false)
                      }}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || undefined} />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{user.name}</p>
                          {user.isFriend && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              Friend
                            </span>
                          )}
                        </div>
                        {user.title && (
                          <p className="text-sm text-gray-500 truncate">{user.title}</p>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-sm text-gray-500">No users found</p>
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}