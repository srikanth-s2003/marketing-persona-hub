import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  MessageSquare,
  Target,
  BarChart3,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Eye,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              MarketingAI Hub
            </span>
          </Link>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            AI Ready
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Marketing AI Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Choose your AI-powered marketing tool and let Gemini help you create amazing content
          </p>
        </div>

        <Tabs defaultValue="personas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 bg-white border">
            <TabsTrigger
              value="personas"
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
            >
              Personas
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700">
              Content
            </TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Analysis
            </TabsTrigger>
            <TabsTrigger
              value="campaigns"
              className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700"
            >
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="market" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700">
              Market
            </TabsTrigger>
            <TabsTrigger
              value="ideas"
              className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700"
            >
              Ideas
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
              Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personas" className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-white">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">AI Persona Generator</CardTitle>
                    <CardDescription className="text-lg">
                      Create detailed customer personas with AI-driven insights
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/tools/personas">
                  <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-lg px-6 py-3">
                    Generate Personas
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-white">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Content Creator</CardTitle>
                    <CardDescription className="text-lg">
                      Generate engaging social media posts, blogs, and marketing copy
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/tools/content">
                  <Button className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-lg px-6 py-3">
                    Create Content
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Content Analysis</CardTitle>
                    <CardDescription className="text-lg">
                      Simulate how your personas interact with marketing content
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/tools/content-analysis">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-6 py-3">
                    Analyze Content
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-white">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Campaign Strategist</CardTitle>
                    <CardDescription className="text-lg">
                      Develop comprehensive marketing campaigns with AI guidance
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/tools/campaigns">
                  <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-lg px-6 py-3">
                    Plan Campaign
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-white">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Market Analyzer</CardTitle>
                    <CardDescription className="text-lg">
                      Get AI-powered insights into market trends and competitors
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/tools/market-analysis">
                  <Button className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-lg px-6 py-3">
                    Analyze Market
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ideas" className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-white">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Creative Brainstormer</CardTitle>
                    <CardDescription className="text-lg">
                      Generate innovative marketing ideas and creative concepts
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/tools/ideas">
                  <Button className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-lg px-6 py-3">
                    Brainstorm Ideas
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-white">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Persona Chat</CardTitle>
                    <CardDescription className="text-lg">
                      Chat with your personas and get authentic feedback on ads
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/tools/persona-chat">
                  <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg px-6 py-3">
                    Start Chatting
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
