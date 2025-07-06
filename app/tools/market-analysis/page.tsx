"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BarChart3, Sparkles, ArrowLeft, Loader2, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import Link from "next/link"

export default function MarketAnalysisPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [formData, setFormData] = useState({
    industry: "",
    product: "",
    targetMarket: "",
    competitors: "",
    additionalInfo: "",
  })

  const analyzeMarket = async () => {
    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/analyze-market", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `API request failed with status ${response.status}`)
      }

      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (error: any) {
      setAnalysis(null)
      const msg = typeof error === "string" ? error : error?.message || "Failed to analyze market"
      alert(msg)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg font-medium">Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Market Analyzer
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
                <BarChart3 className="w-6 h-6 mr-2 text-teal-600" />
                Market Analysis
              </CardTitle>
              <CardDescription>Get AI-powered insights into market trends and competitors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="e.g., SaaS, E-commerce, Healthcare, Fintech"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">Product/Service</Label>
                <Input
                  id="product"
                  placeholder="e.g., Project management tool, Online marketplace"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetMarket">Target Market</Label>
                <Textarea
                  id="targetMarket"
                  placeholder="Describe your target market: geography, demographics, market size..."
                  value={formData.targetMarket}
                  onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="competitors">Known Competitors</Label>
                <Input
                  id="competitors"
                  placeholder="e.g., Slack, Asana, Monday.com (optional)"
                  value={formData.competitors}
                  onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Context</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Any specific market questions, regions of interest, or additional context..."
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  rows={3}
                />
              </div>

              <Button
                onClick={analyzeMarket}
                disabled={isAnalyzing || !formData.industry || !formData.product}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-lg py-3"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Market...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze Market
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-white">
            <CardHeader>
              <CardTitle className="text-2xl">Market Analysis Results</CardTitle>
              <CardDescription>AI-powered market insights and trends</CardDescription>
            </CardHeader>
            <CardContent>
              {!analysis && !isAnalyzing && (
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Fill out the form to get market insights</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center py-12">
                  <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-teal-600" />
                  <p className="text-lg text-gray-600">AI is analyzing the market...</p>
                </div>
              )}

              {analysis && (
                <div className="space-y-6">
                  {/* Market Overview */}
                  {analysis.overview && (
                    <div>
                      <h4 className="font-semibold mb-2">Market Overview</h4>
                      <p className="text-gray-700 bg-teal-50 p-3 rounded-lg">{analysis.overview}</p>
                    </div>
                  )}

                  <Separator />

                  {/* Market Size */}
                  {analysis.marketSize && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-teal-600" />
                        Market Size & Growth
                      </h4>
                      <div className="bg-teal-50 p-3 rounded-lg">
                        <p className="text-gray-700">{analysis.marketSize}</p>
                      </div>
                    </div>
                  )}

                  {/* Trends */}
                  {analysis.trends && (
                    <div>
                      <h4 className="font-semibold mb-3">Market Trends</h4>
                      <div className="space-y-2">
                        {analysis.trends.map((trend: any, index: number) => (
                          <div key={index} className="flex items-start space-x-2 p-2 bg-teal-50 rounded">
                            {trend.type === "positive" ? (
                              <TrendingUp className="w-4 h-4 text-green-600 mt-0.5" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-600 mt-0.5" />
                            )}
                            <span className="text-sm text-gray-700">{trend.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Competitors */}
                  {analysis.competitors && (
                    <div>
                      <h4 className="font-semibold mb-3">Competitive Landscape</h4>
                      <div className="space-y-3">
                        {analysis.competitors.map((competitor: any, index: number) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">{competitor.name}</h5>
                              <Badge variant="outline">{competitor.marketShare}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{competitor.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {competitor.strengths?.map((strength: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="text-xs bg-green-100 text-green-700">
                                  {strength}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Opportunities */}
                  {analysis.opportunities && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                        Market Opportunities
                      </h4>
                      <ul className="space-y-2">
                        {analysis.opportunities.map((opportunity: string, index: number) => (
                          <li key={index} className="text-gray-700 bg-green-50 p-2 rounded border-l-4 border-green-500">
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Challenges */}
                  {analysis.challenges && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <TrendingDown className="w-4 h-4 mr-2 text-red-600" />
                        Market Challenges
                      </h4>
                      <ul className="space-y-2">
                        {analysis.challenges.map((challenge: string, index: number) => (
                          <li key={index} className="text-gray-700 bg-red-50 p-2 rounded border-l-4 border-red-500">
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {analysis.recommendations && (
                    <div>
                      <h4 className="font-semibold mb-2">Strategic Recommendations</h4>
                      <ul className="space-y-2">
                        {analysis.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-gray-700 bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                            {rec}
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
