# 🚀 MarketingAI Hub

An AI-powered marketing platform that helps you create personas, generate content, analyze campaigns, and chat with your target audience. Built with Next.js and powered by Google's Gemini AI.

## ✨ Features

- 🎭 **Smart Persona Generator** - Create detailed customer personas with AI insights
- ✍️ **Content Creator** - Generate social media posts, blogs, and marketing copy
- 🔍 **Content Analysis** - See how your personas react to marketing materials
- 🎯 **Campaign Strategist** - Plan comprehensive marketing campaigns
- 📊 **Market Analyzer** - Get AI-powered market insights and competitor analysis
- 💡 **Creative Brainstormer** - Generate innovative marketing ideas
- 💬 **Persona Chat** - Have conversations with your generated personas

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Get a Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key

2. **Clone and Run**
   \`\`\`bash
   git clone https://github.com/srikanth-s2003/marketing-ai-hub.git
   cd marketing-ai-hub
   
   # Update your API key in docker-compose.yml
   # Then run:
   docker-compose up -d
   \`\`\`

3. **Open** http://localhost:3000

### Option 2: Local Development

1. **Prerequisites**
   - Node.js 18+
   - npm or yarn

2. **Setup**
   \`\`\`bash
   git clone https://github.com/srikanth-s2003/marketing-ai-hub.git
   cd marketing-ai-hub
   npm install
   \`\`\`

3. **Environment Variables**
   \`\`\`bash
   # Create .env.local
   GEMINI_API_KEY=your_gemini_api_key_here
   \`\`\`

4. **Run**
   \`\`\`bash
   npm run dev     # Development
   npm run build   # Production build
   npm start       # Production server
   \`\`\`

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **AI**: Google Gemini AI (via AI SDK)
- **Deployment**: Docker, Docker Compose


## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | ✅ Yes |
| `NODE_ENV` | Environment (development/production) | No |

<div align="center">
  <strong>Built with ❤️ for marketers everywhere</strong>
</div>
