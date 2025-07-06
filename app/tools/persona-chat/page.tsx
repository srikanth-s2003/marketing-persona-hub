"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Send, ArrowLeft, Loader2, User, Bot, ImageIcon } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  role: "user" | "persona"
  content: string
  timestamp: Date
  type?: "text" | "ad-feedback"
}

interface PersonaProfile {
  name: string
  title: string
  age: string
  background: string
  personality: string
}

export default function PersonaChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [persona, setPersona] = useState<PersonaProfile | null>(null)
  const [adContent, setAdContent] = useState("")
  const [showAdFeedback, setShowAdFeedback] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Sample personas (in real app, this would come from your persona generator)
  const samplePersonas = [
    {
      name: "Sarah Chen",
      title: "Tech-Savvy Marketing Manager",
      age: "28-35",
      background: "Works at a mid-size SaaS company, values efficiency and data-driven decisions",
      personality: "Analytical, skeptical of marketing claims, prefers authentic brands",
    },
    {
      name: "Mike Rodriguez",
      title: "Busy Small Business Owner",
      age: "35-45",
      background: "Runs a local restaurant, always looking for cost-effective marketing solutions",
      personality: "Practical, budget-conscious, values personal relationships and community",
    },
    {
      name: "Emma Thompson",
      title: "Health-Conscious Millennial",
      age: "25-32",
      background: "Yoga instructor and wellness blogger, environmentally conscious consumer",
      personality: "Values authenticity, sustainability, and holistic wellness approaches",
    },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const selectPersona = (selectedPersona: PersonaProfile) => {
    setPersona(selectedPersona)
    setMessages([
      {
        id: "1",
        role: "persona",
        content: `Hi! I'm ${selectedPersona.name}, ${selectedPersona.title}. ${selectedPersona.background}. I'm here to give you honest feedback on your marketing materials from my perspective. What would you like to discuss?`,
        timestamp: new Date(),
        type: "text",
      },
    ])
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !persona || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/persona-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: persona,
          message: inputMessage,
          conversationHistory: messages,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const personaMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "persona",
        content: data.response,
        timestamp: new Date(),
        type: "text",
      }

      setMessages((prev) => [...prev, personaMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "persona",
        content: "Sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const getAdFeedback = async () => {
    if (!adContent.trim() || !persona || isLoading) return

    setIsLoading(true)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Please review this ad: "${adContent}"`,
      timestamp: new Date(),
      type: "ad-feedback",
    }

    setMessages((prev) => [...prev, userMessage])

    try {
      const response = await fetch("/api/persona-ad-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: persona,
          adContent: adContent,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get feedback")
      }

      const data = await response.json()

      const feedbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "persona",
        content: data.feedback,
        timestamp: new Date(),
        type: "ad-feedback",
      }

      setMessages((prev) => [...prev, feedbackMessage])
      setAdContent("")
      setShowAdFeedback(false)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg font-medium">Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Persona Chat
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!persona ? (
          // Persona Selection
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Choose a Persona to Chat With</h1>
              <p className="text-gray-600">Select a persona to get authentic feedback on your marketing materials</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {samplePersonas.map((p, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md"
                  onClick={() => selectPersona(p)}
                >
                  <CardHeader className="text-center">
                    <Avatar className="w-16 h-16 mx-auto mb-4">
                      <AvatarFallback className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {p.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl">{p.name}</CardTitle>
                    <CardDescription>{p.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-semibold mb-2">Age</h4>
                        <Badge variant="outline">{p.age}</Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Background</h4>
                        <p className="text-sm text-gray-600">{p.background}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Personality</h4>
                        <p className="text-sm text-gray-600">{p.personality}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-500 mb-4">Or use a persona from your previous generations</p>
              <Button variant="outline">Load My Personas</Button>
            </div>
          </div>
        ) : (
          // Chat Interface
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Persona Info Sidebar */}
              <Card className="lg:col-span-1 border-0 shadow-lg">
                <CardHeader className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarFallback className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {persona.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{persona.name}</CardTitle>
                  <CardDescription>{persona.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Age</h4>
                      <Badge variant="outline">{persona.age}</Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Background</h4>
                      <p className="text-sm text-gray-600">{persona.background}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Personality</h4>
                      <p className="text-sm text-gray-600">{persona.personality}</p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Ad Feedback Section */}
                  <div className="space-y-3">
                    <Button onClick={() => setShowAdFeedback(!showAdFeedback)} variant="outline" className="w-full">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Get Ad Feedback
                    </Button>

                    {showAdFeedback && (
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Paste your ad copy, describe your ad creative, or upload an image..."
                          value={adContent}
                          onChange={(e) => setAdContent(e.target.value)}
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={getAdFeedback}
                            disabled={!adContent.trim() || isLoading}
                            size="sm"
                            className="flex-1"
                          >
                            Get Feedback
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setShowAdFeedback(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button onClick={() => setPersona(null)} variant="ghost" className="w-full mt-4">
                    Switch Persona
                  </Button>
                </CardContent>
              </Card>

              {/* Chat Area */}
              <Card className="lg:col-span-2 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Chat with {persona.name}
                  </CardTitle>
                  <CardDescription>Get authentic feedback and insights from your persona's perspective</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col h-[600px]">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex items-start space-x-2 max-w-[80%] ${
                            message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                          }`}
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarFallback
                              className={`text-sm ${
                                message.role === "user" ? "bg-blue-500 text-white" : "bg-purple-500 text-white"
                              }`}
                            >
                              {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              message.role === "user"
                                ? "bg-blue-500 text-white"
                                : message.type === "ad-feedback"
                                  ? "bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200"
                                  : "bg-gray-100"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}
                            >
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-purple-500 text-white">
                              <Bot className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-gray-100 rounded-lg px-4 py-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ask about marketing strategies, get feedback, or just chat..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                    />
                    <Button onClick={sendMessage} disabled={!inputMessage.trim() || isLoading} size="icon">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
