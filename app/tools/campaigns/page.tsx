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
import { Target, Sparkles, ArrowLeft, Loader2, Calendar, DollarSign, Zap } from "lucide-react"
import Link from "next/link"

export default function CampaignsPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [campaign, setCampaign] = useState<any>(null)
  const [formData, setFormData] = useState({
    product: "",
    targetAudience: "",
    budget: "",
    duration: "",
    goals: "",
    channels: "",
    additionalInfo: "",
  })

  const generateCampaign = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `API request failed with status ${response.status}`)
      }

      const data = await response.json()
      setCampaign(data.campaign)
    } catch (error: any) {
      setCampaign(null)
      const msg = typeof error === "string" ? error : error?.message || "Failed to generate campaign"
      alert(msg)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg font-medium">Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Campaign Strategist
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
                <Target className="w-6 h-6 mr-2 text-orange-600" />
                Create Campaign Strategy
              </CardTitle>
              <CardDescription>Generate comprehensive marketing campaigns with AI guidance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="product">Product/Service</Label>
                <Input
                  id="product"
                  placeholder="e.g., SaaS platform, E-commerce store, Mobile app"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Textarea
                  id="targetAudience"
                  placeholder="Describe your target audience: demographics, interests, pain points..."
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <Select
                    value={formData.budget}
                    onValueChange={(value) => setFormData({ ...formData, budget: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-1k">Under $1,000</SelectItem>
                      <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                      <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                      <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50k+">$50,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Campaign Duration</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) => setFormData({ ...formData, duration: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-week">1 Week</SelectItem>
                      <SelectItem value="2-weeks">2 Weeks</SelectItem>
                      <SelectItem value="1-month">1 Month</SelectItem>
                      <SelectItem value="3-months">3 Months</SelectItem>
                      <SelectItem value="6-months">6 Months</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">Campaign Goals</Label>
                <Select value={formData.goals} onValueChange={(value) => setFormData({ ...formData, goals: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                    <SelectItem value="lead-generation">Lead Generation</SelectItem>
                    <SelectItem value="sales-conversion">Sales Conversion</SelectItem>
                    <SelectItem value="customer-retention">Customer Retention</SelectItem>
                    <SelectItem value="product-launch">Product Launch</SelectItem>
                    <SelectItem value="website-traffic">Website Traffic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="channels">Preferred Channels</Label>
                <Input
                  id="channels"
                  placeholder="e.g., Social Media, Google Ads, Email, Content Marketing"
                  value={formData.channels}
                  onChange={(e) => setFormData({ ...formData, channels: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Any specific requirements, constraints, or additional context..."
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  rows={3}
                />
              </div>

              <Button
                onClick={generateCampaign}
                disabled={isGenerating || !formData.product || !formData.targetAudience}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-lg py-3"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Campaign...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Campaign Strategy
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Campaign */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-white">
            <CardHeader>
              <CardTitle className="text-2xl">Campaign Strategy</CardTitle>
              <CardDescription>AI-powered marketing campaign plan</CardDescription>
            </CardHeader>
            <CardContent>
              {!campaign && !isGenerating && (
                <div className="text-center py-12 text-gray-500">
                  <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Fill out the form to generate your campaign strategy</p>
                </div>
              )}

              {isGenerating && (
                <div className="text-center py-12">
                  <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-orange-600" />
                  <p className="text-lg text-gray-600">AI is creating your campaign strategy...</p>
                </div>
              )}

              {campaign && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">{campaign.name}</h3>
                    <p className="text-gray-600">{campaign.tagline}</p>
                  </div>

                  <Separator />

                  {campaign.overview && (
                    <div>
                      <h4 className="font-semibold mb-2">Campaign Overview</h4>
                      <p className="text-gray-700 bg-orange-50 p-3 rounded-lg">{campaign.overview}</p>
                    </div>
                  )}

                  {campaign.phases && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                        Campaign Phases
                      </h4>
                      <div className="space-y-3">
                        {campaign.phases.map((phase: any, index: number) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">{phase.name}</h5>
                              <Badge variant="outline">{phase.duration}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">{phase.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {campaign.channels && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-orange-600" />
                        Marketing Channels
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {campaign.channels.map((channel: string, index: number) => (
                          <Badge key={index} variant="secondary" className="justify-center py-2">
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {campaign.budget && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-orange-600" />
                        Budget Allocation
                      </h4>
                      <div className="space-y-2">
                        {campaign.budget.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-orange-50 rounded">
                            <span className="text-sm">{item.category}</span>
                            <Badge variant="outline">{item.percentage}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {campaign.kpis && (
                    <div>
                      <h4 className="font-semibold mb-2">Key Performance Indicators</h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {campaign.kpis.map((kpi: string, index: number) => (
                          <li key={index}>{kpi}</li>
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
