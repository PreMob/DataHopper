# DataHopper 🔍

A powerful multi-source research agent that aggregates and analyzes information from Google, Bing, and Reddit to provide comprehensive answers to your questions. Built with FastAPI backend, Next.js frontend, LangGraph, Google Gemini AI, and BrightData APIs.

## 🌟 Features

- **Multi-Source Research**: Simultaneously searches Google, Bing, and Reddit for comprehensive coverage
- **Modern Web Interface**: Beautiful React frontend with real-time updates
- **AI-Powered Analysis**: Uses Google Gemini AI to analyze and synthesize information from different sources
- **Intelligent Reddit Mining**: Automatically selects and analyzes the most relevant Reddit posts and comments
- **RESTful API**: FastAPI backend with comprehensive API documentation
- **Structured Workflow**: Built with LangGraph for reliable, parallel processing
- **Real-time Processing**: Live updates during the research process

## 🏗️ Architecture

DataHopper consists of two main components:

### Backend (FastAPI)
- **Framework**: FastAPI with uvicorn
- **AI Model**: Google Gemini 1.5 Flash
- **Workflow Engine**: LangGraph for orchestrating search and analysis
- **Search Sources**: Google, Bing (via SERP API), Reddit (API + post retrieval)

### Frontend (Next.js)
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion for smooth interactions
- **State Management**: React hooks for real-time updates

### Workflow Architecture
```
START
  ├── Google Search ──┐
  ├── Bing Search ────┼── Reddit Post Analysis
  └── Reddit Search ──┘         │
                                ▼
                      Reddit Post Retrieval
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
            Google Analysis  Bing Analysis  Reddit Analysis
                    │           │           │
                    └───────────┼───────────┘
                                ▼
                        Final Synthesis
                                │
                                ▼
                              END
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- Google Gemini API key
- BrightData API key (or other SERP API keys)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PreMob/DataHopper.git
   cd DataHopper
   ```

2. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   BRIGHTDATA_API_KEY=your_api_key_here
   NEXT_PUBLIC_RESEARCH_API_URL=http://127.0.0.1:8000/api/research
   # Add other API keys as needed
   ```

3. **Install Python dependencies**
   ```bash
   # Create virtual environment (recommended)
   python -m venv myenv
   myenv\Scripts\activate  # Windows
   # source myenv/bin/activate  # macOS/Linux
   
   # Install dependencies
   pip install fastapi uvicorn python-dotenv langgraph google-generativeai pydantic requests
   
   # Or if you have requirements.txt:
   # pip install -r requirements.txt
   ```

4. **Set up frontend**
   ```bash
   cd Frontend
   pnpm install  # or npm install
   cd ..
   ```

5. **Run the application**
   
   **Option 1: Run both services together (Windows)**
   ```bash
   run_both.bat
   # Or use the enhanced startup script:
   start_datahopper.bat
   ```
   
   **Option 2: Run separately**
   
   Terminal 1 - Backend:
   ```bash
   python main.py --api --port=8000
   ```
   
   Terminal 2 - Frontend:
   ```bash
   cd Frontend
   pnpm dev  # or npm run dev
   ```

6. **Access the application**
   - **Frontend UI**: http://localhost:3000
   - **Backend API**: http://127.0.0.1:8000
   - **API Documentation**: http://127.0.0.1:8000/docs

## 🔧 API Endpoints

### Research Endpoint
```bash
POST /api/research
Content-Type: application/json

{
  "question": "Your research question here"
}
```

**Response:**
```json
{
  "final_answer": "Synthesized answer from all sources",
  "google_results": {...},
  "bing_results": {...}, 
  "reddit_results": {...},
  "status": "completed"
}
```

### Health Check
```bash
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "message": "DataHopper API is running"
}
```

## 🚨 Troubleshooting

### Common Issues and Solutions

#### Backend Issues

**1. Module not found errors**
```bash
# Ensure virtual environment is activated
myenv\Scripts\activate  # Windows
# source myenv/bin/activate  # macOS/Linux

# Install missing packages
pip install fastapi uvicorn python-dotenv langgraph google-generativeai pydantic requests
```

**2. BrightData API 400 errors**
- Verify your `BRIGHTDATA_API_KEY` in `.env` file
- Check API key permissions and usage limits
- Ensure proper request format (fixed in recent updates)

**3. Gemini API errors**
- Verify your `GEMINI_API_KEY` in `.env` file
- Check API quota and billing status
- Ensure API key has proper permissions

#### Frontend Issues

**4. Module resolution errors (`@/lib/utils`)**
```bash
cd Frontend
pnpm add clsx tailwind-merge  # or npm install clsx tailwind-merge
```

**5. Missing API URL error**
- Create `Frontend/.env.local` with:
```env
NEXT_PUBLIC_RESEARCH_API_URL=http://127.0.0.1:8000/api/research
```

**6. CORS errors**
- Ensure backend is running on port 8000
- Check frontend is running on port 3000
- Verify CORS origins in main.py

#### Runtime Issues

**7. Redis data type errors**
- This has been fixed in recent updates
- Ensure you're using the latest code version
- Check that all search functions return proper data structures

**8. LangGraph workflow errors**
- Ensure all required environment variables are set
- Check that all imported modules are properly installed
- Verify state management between workflow nodes
{
  "status": "healthy",
  "message": "DataHopper API is running"
}
```

## 📁 Project Structure

```
DataHopper/
├── main.py                    # Backend FastAPI application & LangGraph workflow
├── web_operations.py          # Search API integrations (Google, Bing, Reddit)
├── prompts.py                 # AI prompt templates for analysis
├── snapshot_operations.py     # BrightData snapshot processing utilities
├── .env                      # Environment variables (create this)
├── myenv/                    # Python virtual environment
│   ├── Scripts/              # Activation scripts and executables
│   └── Lib/                  # Installed packages
├── Frontend/
│   ├── .env                  # Frontend environment config
│   ├── package.json          # Frontend dependencies (pnpm)
│   ├── pnpm-lock.yaml        # pnpm lockfile
│   ├── components.json       # shadcn/ui configuration
│   ├── next.config.mjs       # Next.js configuration
│   ├── tsconfig.json         # TypeScript configuration
│   ├── app/
│   │   ├── page.tsx          # Main application page
│   │   ├── layout.tsx        # App layout
│   │   ├── globals.css       # Global styles
│   │   └── api/
│   │       └── research/     # API route handlers
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── chat ui/          # Chat interface components
│   │   ├── research-sources.tsx
│   │   ├── animated-side-border.tsx
│   │   └── ...               # Other UI components
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   ├── hooks/                # Custom React hooks
│   ├── public/               # Static assets
│   └── styles/               # Additional stylesheets
└── __pycache__/              # Python cache files
```

## 🎯 Usage Examples

### Web Interface
1. Open http://localhost:3000 in your browser
2. Enter your research question in the search box
3. Click the search button or press Enter
4. Watch as the system searches multiple sources in real-time
5. View the comprehensive analysis with sources and citations

### Command Line Interface
```bash
python main.py

Ask me anything: What are the latest developments in AI?

Starting parallel research process...
Launching Google, Bing, and Reddit searches...

[Research process with real-time updates]

Final Answer: [Comprehensive analysis from all sources]
```

### API Usage
```bash
curl -X POST "http://127.0.0.1:8000/api/research" \
     -H "Content-Type: application/json" \
     -d '{"question": "What are the benefits of renewable energy?"}'
```

## 🛠️ Configuration

### Environment Variables

**Backend (.env)**:
```env
GEMINI_API_KEY=your_gemini_api_key_here
BRIGHTDATA_API_KEY=your_brightdata_key_here
# Optional: Add other SERP API keys if using alternatives
SERP_API_KEY=your_serp_api_key_here
```

**Frontend (Frontend/.env.local)**:
```env
NEXT_PUBLIC_RESEARCH_API_URL=http://127.0.0.1:8000/api/research
```

### API Keys Setup

#### Google Gemini API
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `GEMINI_API_KEY`

#### SERP API (for Google/Bing search)
1. Sign up at your preferred SERP API provider
2. Get your API key
3. Add it to your `.env` file as `SERP_API_KEY`

## 🧩 Core Components

### Backend Components

1. **main.py** - Main application orchestrating the research workflow
   - FastAPI web server with CORS support
   - LangGraph workflow definition
   - State management between research phases
   - API endpoints for frontend integration

2. **web_operations.py** - External API integrations
   - SERP search for Google and Bing
   - Reddit API search and post retrieval
   - Data formatting and error handling

3. **prompts.py** - AI analysis templates
   - Specialized prompts for different sources
   - Analysis types: Google facts, Bing perspectives, Reddit insights
   - Synthesis logic for combining multiple analyses

### Frontend Components

1. **page.tsx** - Main application interface
   - Real-time search progress indicators
   - Message-based chat interface
   - Source display and citation
   - Responsive design with animations

2. **components/** - Reusable UI components
   - Research sources display
   - Chat bubbles and input
   - Loading skeletons
   - Theme provider for dark/light mode

## 🔍 How It Works

### Research Process Flow
1. **User Input**: Question submitted via web interface or API
2. **Parallel Search**: Simultaneously queries Google, Bing, and Reddit
3. **Reddit Analysis**: AI selects most relevant Reddit discussions
4. **Content Retrieval**: Downloads detailed Reddit post content
5. **Source Analysis**: Separate AI analysis for each source type
6. **Synthesis**: Combines insights into a final comprehensive answer
7. **Response**: Returns structured results with sources

### Multi-Source Analysis
- **Google**: Authoritative sources, official information, recent news
- **Bing**: Microsoft ecosystem perspectives, technical documentation
- **Reddit**: Community experiences, real user opinions, practical discussions

### AI-Powered Synthesis
The final step combines all analyses to provide:
- Balanced perspectives from multiple sources
- Identification of common themes and contradictions  
- Source attribution for key claims
- Comprehensive answer addressing the original question

## 🚀 Development

### Backend Development
```bash
# Run backend in development mode
python main.py --api --port=8000

# Access API documentation
open http://127.0.0.1:8000/docs
```

### Frontend Development  
```bash
cd Frontend

# Install dependencies
pnpm install  # or npm install

# Run development server with hot reload
pnpm dev  # or npm run dev

# Build for production
pnpm build  # or npm run build
pnpm start  # or npm start
```

### Creating requirements.txt
If you don't have a requirements.txt file, create one with:
```bash
# In the root directory
pip freeze > requirements.txt
```

Or create it manually with the core dependencies:
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-dotenv==1.0.0
google-generativeai==0.3.2
langgraph==0.0.55
pydantic==2.5.0
requests==2.31.0
typing-extensions==4.8.0
```

### Integration Testing
1. Start both backend and frontend
2. Test the research flow end-to-end
3. Verify source data is properly displayed
4. Check error handling and loading states

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test both backend and frontend functionality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you encounter any issues or have questions:

1. Check the existing [issues](https://github.com/PreMob/DataHopper/issues)
2. Create a new issue with detailed information
3. Provide your environment details and error messages

## 🔮 Future Enhancements

- [ ] Add more search engines (DuckDuckGo, Yahoo)
- [ ] Real-time streaming responses
- [ ] User authentication and saved searches
- [ ] Export results to different formats (PDF, JSON)
- [ ] Advanced filtering and source preferences
- [ ] Caching system for faster repeated queries
- [ ] Mobile app development
- [ ] Rate limiting and API usage monitoring
- [ ] Improved error recovery mechanisms

---

**DataHopper** - *Hop across data sources for comprehensive research* 🐇