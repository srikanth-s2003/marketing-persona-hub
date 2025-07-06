"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Users, Sparkles, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, MessageCircle, User, Bot, ImageIcon, Copy, Download } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function PersonasPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [persona, setPersona] = useState<any>(null)
  const [formData, setFormData] = useState({
    // Demographics
    age: "",
    gender: "",
    location: "",
    income: "",
    profession: "",
    education: "",

    // Psychographics
    personalityType: "",
    lifestyle: "",
    coreValues: "",
    decisionMaking: "",
    painPoints: "",
    shoppingMotivation: "",

    // Media Habits
    devices: "",
    socialPlatforms: "",
    contentType: "",
    brandTrust: "",

    // Personality Traits (sliders)
    trustLevel: "5",
    innovationLevel: "5",
    priceVsQuality: "5",
    socialLevel: "5",

    // Optional
    personalitySeed: "",

    // Business Context
    industry: "",
    product: "",
    additionalInfo: "",
  })

  // Chat functionality states
  const [messages, setMessages] = useState<any[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [adContent, setAdContent] = useState("")
  const [showAdFeedback, setShowAdFeedback] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const generatePersona = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `API request failed with status ${response.status}`)
      }

      const data = await response.json()
      setPersona(data.persona)
    } catch (error: any) {
      setPersona(null)
      const msg = typeof error === "string" ? error : error?.message || "Failed to generate persona"
      alert(msg)
    } finally {
      setIsGenerating(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize chat when persona is generated
  useEffect(() => {
    if (persona && messages.length === 0) {
      setMessages([
        {
          id: "1",
          role: "persona",
          content: `Hi! I'm ${persona.name}, ${persona.title}. ${persona.background}. I'm here to give you honest feedback on your marketing materials from my perspective. What would you like to discuss?`,
          timestamp: new Date(),
          type: "text",
        },
      ])
    }
  }, [persona])

  const sendMessage = async () => {
    if (!inputMessage.trim() || !persona || isChatLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsChatLoading(true)

    try {
      const response = await fetch("/api/persona-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: {
            name: persona.name,
            title: persona.title,
            age: persona.age,
            background: persona.background,
            personality: `${persona.goals?.join(", ")} | Pain points: ${persona.painPoints?.join(", ")}`,
          },
          message: inputMessage,
          conversationHistory: messages,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()
      const personaMessage = {
        id: (Date.now() + 1).toString(),
        role: "persona",
        content: data.response,
        timestamp: new Date(),
        type: "text",
      }

      setMessages((prev) => [...prev, personaMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "persona",
        content: "Sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsChatLoading(false)
    }
  }

  const getAdFeedback = async () => {
    if (!adContent.trim() || !persona || isChatLoading) return

    setIsChatLoading(true)

    const userMessage = {
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
          persona: {
            name: persona.name,
            title: persona.title,
            age: persona.age,
            background: persona.background,
            personality: `${persona.goals?.join(", ")} | Pain points: ${persona.painPoints?.join(", ")}`,
          },
          adContent: adContent,
        }),
      })

      if (!response.ok) throw new Error("Failed to get feedback")

      const data = await response.json()
      const feedbackMessage = {
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
      setIsChatLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const copyPersonaData = () => {
    const personaText = `
Name: ${persona.name}
Title: ${persona.title}
Age: ${persona.age}
Location: ${persona.location}
Background: ${persona.background}
Goals: ${persona.goals?.join(", ")}
Pain Points: ${persona.painPoints?.join(", ")}
Marketing Tips: ${persona.marketingTips?.join(", ")}
    `.trim()

    navigator.clipboard.writeText(personaText)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-lg font-medium">Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Persona Generator
                </h1>
                <p className="text-sm text-gray-500">Create & Chat with AI Personas</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Create Your Persona</CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Provide details about your business and target audience
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Demographics Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-sm">1</span>
                    </div>
                    <h3 className="text-lg font-semibold text-purple-700">Demographics</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                        Age Range
                      </Label>
                      <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select age range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="18-24">18-24</SelectItem>
                          <SelectItem value="25-34">25-34</SelectItem>
                          <SelectItem value="35-44">35-44</SelectItem>
                          <SelectItem value="45-54">45-54</SelectItem>
                          <SelectItem value="55-64">55-64</SelectItem>
                          <SelectItem value="65+">65+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                        Gender
                      </Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="non-binary">Non-binary</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                        Location
                      </Label>
                      <Input
                        id="location"
                        placeholder="e.g., Urban US, Rural Europe, Asia-Pacific"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="income" className="text-sm font-medium text-gray-700">
                        Income Level
                      </Label>
                      <Select
                        value={formData.income}
                        onValueChange={(value) => setFormData({ ...formData, income: value })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select income level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-30k">Under $30k</SelectItem>
                          <SelectItem value="30k-50k">$30k - $50k</SelectItem>
                          <SelectItem value="50k-75k">$50k - $75k</SelectItem>
                          <SelectItem value="75k-100k">$75k - $100k</SelectItem>
                          <SelectItem value="100k-150k">$100k - $150k</SelectItem>
                          <SelectItem value="150k+">$150k+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profession" className="text-sm font-medium text-gray-700">
                        Profession
                      </Label>
                      <Input
                        id="profession"
                        placeholder="e.g., Software Engineer, Teacher, Marketing Manager"
                        value={formData.profession}
                        onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="education" className="text-sm font-medium text-gray-700">
                        Education Level
                      </Label>
                      <Select
                        value={formData.education}
                        onValueChange={(value) => setFormData({ ...formData, education: value })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high-school">High School</SelectItem>
                          <SelectItem value="some-college">Some College</SelectItem>
                          <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                          <SelectItem value="masters">Master's Degree</SelectItem>
                          <SelectItem value="doctorate">Doctorate</SelectItem>
                          <SelectItem value="trade-school">Trade School</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Psychographics Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                      <span className="text-pink-600 font-semibold text-sm">2</span>
                    </div>
                    <h3 className="text-lg font-semibold text-pink-700">Psychographics</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="personalityType" className="text-sm font-medium text-gray-700">
                        Personality Type
                      </Label>
                      <Select
                        value={formData.personalityType}
                        onValueChange={(value) => setFormData({ ...formData, personalityType: value })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select personality type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="intj">INTJ - The Architect</SelectItem>
                          <SelectItem value="intp">INTP - The Thinker</SelectItem>
                          <SelectItem value="entj">ENTJ - The Commander</SelectItem>
                          <SelectItem value="entp">ENTP - The Debater</SelectItem>
                          <SelectItem value="infj">INFJ - The Advocate</SelectItem>
                          <SelectItem value="infp">INFP - The Mediator</SelectItem>
                          <SelectItem value="enfj">ENFJ - The Protagonist</SelectItem>
                          <SelectItem value="enfp">ENFP - The Campaigner</SelectItem>
                          <SelectItem value="istj">ISTJ - The Logistician</SelectItem>
                          <SelectItem value="isfj">ISFJ - The Protector</SelectItem>
                          <SelectItem value="estj">ESTJ - The Executive</SelectItem>
                          <SelectItem value="esfj">ESFJ - The Consul</SelectItem>
                          <SelectItem value="istp">ISTP - The Virtuoso</SelectItem>
                          <SelectItem value="isfp">ISFP - The Adventurer</SelectItem>
                          <SelectItem value="estp">ESTP - The Entrepreneur</SelectItem>
                          <SelectItem value="esfp">ESFP - The Entertainer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lifestyle" className="text-sm font-medium text-gray-700">
                        Lifestyle
                      </Label>
                      <Select
                        value={formData.lifestyle}
                        onValueChange={(value) => setFormData({ ...formData, lifestyle: value })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select lifestyle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="busy-professional">Busy Professional</SelectItem>
                          <SelectItem value="family-focused">Family Focused</SelectItem>
                          <SelectItem value="health-conscious">Health Conscious</SelectItem>
                          <SelectItem value="tech-savvy">Tech Savvy</SelectItem>
                          <SelectItem value="environmentally-conscious">Environmentally Conscious</SelectItem>
                          <SelectItem value="luxury-oriented">Luxury Oriented</SelectItem>
                          <SelectItem value="budget-conscious">Budget Conscious</SelectItem>
                          <SelectItem value="adventure-seeker">Adventure Seeker</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="coreValues" className="text-sm font-medium text-gray-700">
                        Core Values
                      </Label>
                      <Input
                        id="coreValues"
                        placeholder="e.g., Family, Success, Authenticity, Innovation"
                        value={formData.coreValues}
                        onChange={(e) => setFormData({ ...formData, coreValues: e.target.value })}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="decisionMaking" className="text-sm font-medium text-gray-700">
                        Decision Making Style
                      </Label>
                      <Select
                        value={formData.decisionMaking}
                        onValueChange={(value) => setFormData({ ...formData, decisionMaking: value })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select decision style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="analytical">Analytical - Research heavy</SelectItem>
                          <SelectItem value="intuitive">Intuitive - Gut feeling</SelectItem>
                          <SelectItem value="social">Social - Seeks opinions</SelectItem>
                          <SelectItem value="impulsive">Impulsive - Quick decisions</SelectItem>
                          <SelectItem value="cautious">Cautious - Risk averse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="painPoints" className="text-sm font-medium text-gray-700">
                        Main Pain Points
                      </Label>
                      <Input
                        id="painPoints"
                        placeholder="e.g., Time constraints, Budget limitations, Complexity"
                        value={formData.painPoints}
                        onChange={(e) => setFormData({ ...formData, painPoints: e.target.value })}
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Personality Traits Sliders */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold text-sm">3</span>
                    </div>
                    <h3 className="text-lg font-semibold text-indigo-700">Personality Traits</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-medium text-gray-700">
                        <span>Trusting</span>
                        <span>Skeptical</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={formData.trustLevel}
                        onChange={(e) => setFormData({ ...formData, trustLevel: e.target.value })}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="text-center">
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                          Trust Level: {formData.trustLevel}/10
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-medium text-gray-700">
                        <span>Conservative</span>
                        <span>Innovative</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={formData.innovationLevel}
                        onChange={(e) => setFormData({ ...formData, innovationLevel: e.target.value })}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="text-center">
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                          Innovation Level: {formData.innovationLevel}/10
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-medium text-gray-700">
                        <span>Price Sensitive</span>
                        <span>Quality Focused</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={formData.priceVsQuality}
                        onChange={(e) => setFormData({ ...formData, priceVsQuality: e.target.value })}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="text-center">
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                          Price vs Quality: {formData.priceVsQuality}/10
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Business Context */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm">4</span>
                    </div>
                    <h3 className="text-lg font-semibold text-green-700">Business Context</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="industry" className="text-sm font-medium text-gray-700">
                        Industry *
                      </Label>
                      <Input
                        id="industry"
                        placeholder="e.g., E-commerce, SaaS, Healthcare"
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="h-11"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product" className="text-sm font-medium text-gray-700">
                        Product/Service *
                      </Label>
                      <Input
                        id="product"
                        placeholder="e.g., Online fitness app, B2B software"
                        value={formData.product}
                        onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                        className="h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo" className="text-sm font-medium text-gray-700">
                      Additional Context
                    </Label>
                    <Textarea
                      id="additionalInfo"
                      placeholder="Any specific requirements, market context, or additional details..."
                      value={formData.additionalInfo}
                      onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </div>

                <Button
                  onClick={generatePersona}
                  disabled={isGenerating || !formData.industry || !formData.product}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Generating Detailed Persona...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-3" />
                      Generate AI Persona
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Generated Persona with Chat */}
          <div className="space-y-6">
            {/* Persona Display */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Generated Persona</CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      AI-powered customer persona based on your inputs
                    </CardDescription>
                  </div>
                  {persona && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={copyPersonaData} className="h-9 bg-transparent">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" className="h-9 bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!persona && !isGenerating && (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Users className="w-10 h-10 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Create Your Persona</h3>
                    <p className="text-gray-600">
                      Fill out the form and click generate to create your detailed persona
                    </p>
                  </div>
                )}

                {isGenerating && (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Creating Your Persona</h3>
                    <p className="text-gray-600">AI is analyzing your inputs and generating a detailed persona...</p>
                  </div>
                )}

                {persona && (
                  <div className="space-y-6">
                    {/* Persona Header */}
                    <div className="text-center pb-6 border-b border-gray-100">
                      <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-3xl font-bold text-white">{persona.name?.[0] || "P"}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{persona.name || "Marketing Persona"}</h3>
                      <p className="text-lg text-gray-600">{persona.title || "Target Customer"}</p>
                    </div>

                    {/* Persona Details */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                            <span className="text-purple-600 text-xs font-bold">D</span>
                          </div>
                          Demographics
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {persona.age && (
                            <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                              Age: {persona.age}
                            </Badge>
                          )}
                          {persona.location && (
                            <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                              {persona.location}
                            </Badge>
                          )}
                          {persona.income && (
                            <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                              {persona.income}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {persona.background && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                              <span className="text-blue-600 text-xs font-bold">B</span>
                            </div>
                            Background
                          </h4>
                          <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-100">
                            {persona.background}
                          </p>
                        </div>
                      )}

                      {persona.goals && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                              <span className="text-green-600 text-xs font-bold">G</span>
                            </div>
                            Goals & Motivations
                          </h4>
                          <ul className="space-y-2">
                            {persona.goals.map((goal: string, index: number) => (
                              <li key={index} className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700">{goal}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {persona.painPoints && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                            <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center mr-2">
                              <span className="text-red-600 text-xs font-bold">P</span>
                            </div>
                            Pain Points
                          </h4>
                          <ul className="space-y-2">
                            {persona.painPoints.map((pain: string, index: number) => (
                              <li key={index} className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700">{pain}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {persona.marketingTips && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                            <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center mr-2">
                              <span className="text-orange-600 text-xs font-bold">M</span>
                            </div>
                            Marketing Recommendations
                          </h4>
                          <ul className="space-y-2">
                            {persona.marketingTips.map((tip: string, index: number) => (
                              <li key={index} className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chat Interface - Only show when persona exists */}
            {persona && (
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">Chat with {persona.name}</CardTitle>
                        <CardDescription className="text-gray-600">
                          Get authentic feedback and insights from your persona's perspective
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Online
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Ad Feedback Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                    <Button
                      onClick={() => setShowAdFeedback(!showAdFeedback)}
                      variant="outline"
                      className="w-full h-11 bg-white/80 hover:bg-white border-blue-200 text-blue-700 hover:text-blue-800"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Get Ad Feedback
                    </Button>

                    {showAdFeedback && (
                      <div className="mt-4 space-y-3">
                        <Textarea
                          placeholder="Paste your ad copy, describe your ad creative, or upload an image..."
                          value={adContent}
                          onChange={(e) => setAdContent(e.target.value)}
                          rows={4}
                          className="resize-none bg-white/80 border-blue-200"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={getAdFeedback}
                            disabled={!adContent.trim() || isChatLoading}
                            className="flex-1 h-10 bg-blue-600 hover:bg-blue-700"
                          >
                            {isChatLoading ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <ImageIcon className="w-4 h-4 mr-2" />
                            )}
                            Get Feedback
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowAdFeedback(false)}
                            className="h-10 border-blue-200 text-blue-700 hover:text-blue-800"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Messages */}
                  <div className="h-[500px] flex flex-col">
                    <ScrollArea className="flex-1 pr-4">
                      <div className="space-y-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`flex items-start space-x-3 max-w-[85%] ${
                                message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                              }`}
                            >
                              <Avatar className="w-10 h-10 shadow-md">
                                <AvatarFallback
                                  className={`text-sm font-medium ${
                                    message.role === "user"
                                      ? "bg-blue-500 text-white"
                                      : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                  }`}
                                >
                                  {message.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                </AvatarFallback>
                              </Avatar>
                              <div
                                className={`rounded-2xl px-4 py-3 shadow-sm ${
                                  message.role === "user"
                                    ? "bg-blue-500 text-white"
                                    : message.type === "ad-feedback"
                                      ? "bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 text-gray-800"
                                      : "bg-white border border-gray-200 text-gray-800"
                                }`}
                              >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                <p
                                  className={`text-xs mt-2 ${
                                    message.role === "user" ? "text-blue-100" : "text-gray-500"
                                  }`}
                                >
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {isChatLoading && (
                          <div className="flex justify-start">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-10 h-10 shadow-md">
                                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                  <Bot className="w-5 h-5" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                                <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="flex space-x-3 mt-4">
                      <Input
                        placeholder="Ask about marketing strategies, get feedback, or just chat..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isChatLoading}
                        className="flex-1 h-12 bg-white/80 border-gray-200"
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || isChatLoading}
                        className="h-12 w-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
