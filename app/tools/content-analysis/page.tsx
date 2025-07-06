"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Eye, MousePointer, X, Heart, TrendingUp, ArrowLeft, Loader2, Upload, FileText, ImageIcon } from "lucide-react"
import Link from "next/link"

interface PersonaAnalysis {
  emotionalSummary: string
  whatTheyNotice: string[]
  whatTheyClick: string[]
  whatTurnsThemOff: string[]
  wouldConvert: boolean
  emotionalResponse: string
  prosAndCons: {
    pros: string[]
    cons: string[]
  }
  conversionLikelihood: number
  improvementSuggestions: string[]
  confidenceLevel: number
}

export default function ContentAnalysisPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<PersonaAnalysis | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    marketingContent: "",
    personaContext: "",
    contentType: "landing-page",
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setUploadedImage(null)
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const analyzeContent = async () => {
    setIsAnalyzing(true)

    try {
      let contentToAnalyze = formData.marketingContent

      // If there's an uploaded image, describe it for analysis
      if (uploadedImage && imageFile) {
        contentToAnalyze += `\n\n[IMAGE UPLOADED: ${imageFile.name} - Please analyze this image as part of the marketing content. Consider visual elements, design, colors, text placement, and overall visual appeal from the persona's perspective.]`
      }

      const response = await fetch("/api/analyze-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          marketingContent: contentToAnalyze,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `API request failed with status ${response.status}`)
      }

      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (error: any) {
      setAnalysis(null)
      const msg = typeof error === "string" ? error : error?.message || "Failed to analyze content"
      alert(msg)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getConversionColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100"
    if (score >= 60) return "text-yellow-600 bg-yellow-100"
    if (score >= 40) return "text-orange-600 bg-orange-100"
    return "text-red-600 bg-red-100"
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-orange-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg font-medium">Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Content Analysis
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
                <FileText className="w-6 h-6 mr-2 text-blue-600" />
                Analyze Marketing Content
              </CardTitle>
              <CardDescription>Simulate how your persona would interact with your marketing materials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="personaContext">Persona Context</Label>
                <Textarea
                  id="personaContext"
                  placeholder="Describe your target persona: demographics, psychographics, pain points, goals, etc. Or paste a previously generated persona profile..."
                  value={formData.personaContext}
                  onChange={(e) => setFormData({ ...formData, personaContext: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contentType">Content Type</Label>
                <select
                  id="contentType"
                  value={formData.contentType}
                  onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="landing-page">Landing Page</option>
                  <option value="email">Email Campaign</option>
                  <option value="social-media">Social Media Post</option>
                  <option value="advertisement">Advertisement</option>
                  <option value="product-page">Product Page</option>
                  <option value="blog-post">Blog Post</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="marketingContent">Marketing Content</Label>
                <Textarea
                  id="marketingContent"
                  placeholder="Paste your marketing copy, email content, ad text, or describe your content here..."
                  value={formData.marketingContent}
                  onChange={(e) => setFormData({ ...formData, marketingContent: e.target.value })}
                  rows={8}
                />
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <Label>Upload Screenshot or Image</Label>

                {!uploadedImage ? (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-700 mb-2">Upload Marketing Image</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Upload screenshots of ads, landing pages, social media posts, or any marketing visuals
                    </p>
                    <Button variant="outline" type="button" className="bg-white">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                    <p className="text-xs text-gray-400 mt-2">Supports JPG, PNG, GIF up to 10MB</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative border rounded-lg overflow-hidden">
                      <img
                        src={uploadedImage || "/placeholder.svg"}
                        alt="Uploaded marketing content"
                        className="w-full h-auto max-h-64 object-contain bg-gray-50"
                      />
                      <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={removeImage}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <span className="flex items-center">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        {imageFile?.name}
                      </span>
                      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                        Change Image
                      </Button>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <Button
                onClick={analyzeContent}
                disabled={isAnalyzing || (!formData.marketingContent && !uploadedImage) || !formData.personaContext}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-3"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Content...
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5 mr-2" />
                    Analyze with Persona
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
              <CardTitle className="text-2xl">Persona Analysis Results</CardTitle>
              <CardDescription>How your target persona would interact with this content</CardDescription>
            </CardHeader>
            <CardContent>
              {!analysis && !isAnalyzing && (
                <div className="text-center py-12 text-gray-500">
                  <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Add your persona context and marketing content to get started</p>
                  <p className="text-sm mt-2">You can upload images or describe your marketing materials</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center py-12">
                  <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-blue-600" />
                  <p className="text-lg text-gray-600">AI is analyzing your content...</p>
                </div>
              )}

              {analysis && (
                <div className="space-y-6">
                  {/* Conversion Score */}
                  <div className="text-center p-4 rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100">
                    <div className="text-3xl font-bold mb-2">
                      <span className={`px-3 py-1 rounded-full ${getConversionColor(analysis.conversionLikelihood)}`}>
                        {analysis.conversionLikelihood}%
                      </span>
                    </div>
                    <p className="text-gray-700">Conversion Likelihood</p>
                  </div>

                  {/* Confidence Level */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Confidence Level</span>
                      <span className="text-sm text-gray-600">{analysis.confidenceLevel}%</span>
                    </div>
                    <Progress value={analysis.confidenceLevel} className="h-2" />
                  </div>

                  <Separator />

                  {/* Emotional Summary */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Heart className="w-4 h-4 mr-2 text-red-500" />
                      Emotional Response
                    </h4>
                    <p className="text-gray-700 bg-red-50 p-3 rounded-lg">{analysis.emotionalResponse}</p>
                  </div>

                  {/* What They Notice */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Eye className="w-4 h-4 mr-2 text-blue-500" />
                      What They Notice First
                    </h4>
                    <ul className="space-y-1">
                      {analysis.whatTheyNotice.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <Badge variant="outline" className="mr-2 mt-0.5 bg-blue-50 text-blue-700">
                            {index + 1}
                          </Badge>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* What They Click */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <MousePointer className="w-4 h-4 mr-2 text-green-500" />
                      What They're Likely to Click
                    </h4>
                    <ul className="space-y-1">
                      {analysis.whatTheyClick.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <Badge variant="outline" className="mr-2 mt-0.5 bg-green-50 text-green-700">
                            ✓
                          </Badge>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* What Turns Them Off */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <X className="w-4 h-4 mr-2 text-red-500" />
                      What Turns Them Off
                    </h4>
                    <ul className="space-y-1">
                      {analysis.whatTurnsThemOff.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <Badge variant="outline" className="mr-2 mt-0.5 bg-red-50 text-red-700">
                            ✗
                          </Badge>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pros and Cons */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-green-700">Pros</h4>
                      <ul className="space-y-1">
                        {analysis.prosAndCons.pros.map((pro, index) => (
                          <li key={index} className="text-sm text-gray-700 bg-green-50 p-2 rounded">
                            + {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-red-700">Cons</h4>
                      <ul className="space-y-1">
                        {analysis.prosAndCons.cons.map((con, index) => (
                          <li key={index} className="text-sm text-gray-700 bg-red-50 p-2 rounded">
                            - {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Improvement Suggestions */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-purple-500" />
                      Improvement Suggestions
                    </h4>
                    <ul className="space-y-2">
                      {analysis.improvementSuggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="text-gray-700 bg-purple-50 p-3 rounded-lg border-l-4 border-purple-500"
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Conversion Decision */}
                  <div className="text-center p-4 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="font-semibold mb-2">Would they convert?</p>
                    <Badge
                      variant={analysis.wouldConvert ? "default" : "destructive"}
                      className={`text-lg px-4 py-2 ${
                        analysis.wouldConvert ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {analysis.wouldConvert ? "YES" : "NO"}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
