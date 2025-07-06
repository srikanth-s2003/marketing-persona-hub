"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Lightbulb, Sparkles, ArrowLeft, Loader2, Zap, Star, Target } from "lucide-react"
import Link from "next/link"

export default function IdeasPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [ideas, setIdeas] = useState<any>(null)
  const [formData, setFormData] = useState({
    business: "",
    challenge: "",
    audience: "",
    budget: "",
    timeframe: "",
    creativity: "balanced",
    additionalInfo: "",
  })

  const generateIdeas = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `API request failed with status ${response.status}`)
      }

      const data = await response.json()
      setIdeas(data.ideas)
    } catch (error: any) {
      setIdeas(null)
      const msg = typeof error === "string" ? error : error?.message || "Failed to generate ideas"
      alert(msg)
    } finally {
      setIsGenerating(false)
    }
  }

  const getCreativityColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-purple-100 text-purple-700"
      case "medium":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-green-100 text-green-700"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg font-medium">Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Creative Brainstormer
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Lightbulb className="w-6 h-6 mr-2 text-indigo-600" />
                Generate Creative Ideas
              </CardTitle>
              <CardDescription>Brainstorm innovative marketing ideas and creative concepts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="business">Business/Product</Label>
                <Input
                  id="business"
                  placeholder="e.g., Eco-friendly clothing brand, AI productivity tool"
                  value={formData.business}
                  onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenge">Marketing Challenge</Label>
                <Textarea
                  id="challenge"
                  placeholder="What specific marketing challenge are you trying to solve? e.g., Low brand awareness, need viral campaign ideas..."
                  value={formData.challenge}
                  onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Input
                  id="audience"
                  placeholder="e.g., Gen Z consumers, B2B decision makers, busy parents"
                  value={formData.audience}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Level</Label>
                  <Select
                    value={formData.budget}
                    onValueChange={(value) => setFormData({ ...formData, budget: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal ($0-$1k)</SelectItem>
                      <SelectItem value="small">Small ($1k-$5k)</SelectItem>
                      <SelectItem value="medium">Medium ($5k-$25k)</SelectItem>
                      <SelectItem value="large">Large ($25k+)</SelectItem>
                      <SelectItem value="unlimited">No Budget Constraints</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Select
                    value={formData.timeframe}
                    onValueChange={(value) => setFormData({ ...formData, timeframe: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate (1-2 weeks)</SelectItem>
                      <SelectItem value="short">Short-term (1-3 months)</SelectItem>
                      <SelectItem value="medium">Medium-term (3-6 months)</SelectItem>
                      <SelectItem value="long">Long-term (6+ months)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="creativity">Creativity Level</Label>
                <Select
                  value={formData.creativity}
                  onValueChange={(value) => setFormData({ ...formData, creativity: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select creativity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative - Safe, proven approaches</SelectItem>
                    <SelectItem value="balanced">Balanced - Mix of safe and creative</SelectItem>
                    <SelectItem value="creative">Creative - Bold, innovative ideas</SelectItem>
                    <SelectItem value="wild">Wild - Out-of-the-box, experimental</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Context</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Any specific requirements, constraints, or inspiration sources..."
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  rows={3}
                />
              </div>

              <Button
                onClick={generateIdeas}
                disabled={isGenerating || !formData.business || !formData.challenge}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg py-3"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Ideas...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Creative Ideas
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Ideas */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-white">
            <CardHeader>
              <CardTitle className="text-2xl">Creative Ideas</CardTitle>
              <CardDescription>AI-generated marketing concepts and strategies</CardDescription>
            </CardHeader>
            <CardContent>
              {!ideas && !isGenerating && (
                <div className="text-center py-12 text-gray-500">
                  <Lightbulb className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Fill out the form to generate creative marketing ideas</p>
                </div>
              )}

              {isGenerating && (
                <div className="text-center py-12">
                  <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-indigo-600" />
                  <p className="text-lg text-gray-600">AI is brainstorming creative ideas...</p>
                </div>
              )}

              {ideas && (
                <div className="space-y-6">
                  {/* Quick Win Ideas */}
                  {ideas.quickWins && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-yellow-600" />
                        Quick Win Ideas
                      </h4>
                      <div className="space-y-3">
                        {ideas.quickWins.map((idea: any, index: number) => (
                          <div key={index} className="border rounded-lg p-3 bg-yellow-50">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium">{idea.title}</h5>
                              <Badge className={getCreativityColor(idea.difficulty)}>{idea.difficulty} effort</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{idea.description}</p>
                            <div className="text-xs text-gray-500">
                              <span className="font-medium">Timeline:</span> {idea.timeline}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Creative Campaigns */}
                  {ideas.campaigns && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Target className="w-4 h-4 mr-2 text-indigo-600" />
                        Campaign Ideas
                      </h4>
                      <div className="space-y-3">
                        {ideas.campaigns.map((campaign: any, index: number) => (
                          <div key={index} className="border rounded-lg p-4 bg-indigo-50">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-lg">{campaign.name}</h5>
                              <Badge className={getCreativityColor(campaign.creativity)}>
                                {campaign.creativity} creativity
                              </Badge>
                            </div>
                            <p className="text-gray-700 mb-3">{campaign.concept}</p>
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium text-sm">Execution:</span>
                                <p className="text-sm text-gray-600">{campaign.execution}</p>
                              </div>
                              <div>
                                <span className="font-medium text-sm">Expected Impact:</span>
                                <p className="text-sm text-gray-600">{campaign.impact}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Content Ideas */}
                  {ideas.contentIdeas && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Star className="w-4 h-4 mr-2 text-purple-600" />
                        Content Ideas
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {ideas.contentIdeas.map((content: any, index: number) => (
                          <div key={index} className="border rounded-lg p-3 bg-purple-50">
                            <h5 className="font-medium mb-1">{content.type}</h5>
                            <p className="text-sm text-gray-600 mb-2">{content.description}</p>
                            <Badge variant="outline" className="text-xs">
                              {content.platform}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Implementation Tips */}
                  {ideas.implementationTips && (
                    <div>
                      <h4 className="font-semibold mb-2">Implementation Tips</h4>
                      <ul className="space-y-2">
                        {ideas.implementationTips.map((tip: string, index: number) => (
                          <li key={index} className="text-gray-700 bg-blue-50 p-2 rounded border-l-4 border-blue-500">
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
