# DataHopper 🔍

A powerful multi-source research agent that aggregates and analyzes information from Google, Bing, and Reddit to provide comprehensive answers to your questions. Built with LangGraph, Google Gemini AI, and BrightData APIs.

## 🌟 Features

- **Multi-Source Research**: Simultaneously searches Google, Bing, and Reddit for comprehensive coverage
- **AI-Powered Analysis**: Uses Google Gemini AI to analyze and synthesize information from different sources
- **Intelligent Reddit Mining**: Automatically selects and analyzes the most relevant Reddit posts and comments
- **Structured Workflow**: Built with LangGraph for reliable, parallel processing
- **Real-time Processing**: Live updates during the research process

## 🏗️ Architecture

DataHopper uses a sophisticated graph-based workflow that processes research in parallel and synthesizes results:

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
- Google Gemini API key
- BrightData API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PreMob/DataHopper.git
   cd DataHopper
   ```

2. **Set up virtual environment**
   ```bash
   python -m venv myenv
   
   # Windows
   myenv\Scripts\activate
   
   # macOS/Linux
   source myenv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install python-dotenv langgraph langchain typing-extensions pydantic requests google-generativeai langchain-google-genai
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   BRIGHTDATA_API_KEY=your_brightdata_api_key_here
   ```

5. **Run the application**
   ```bash
   python main.py
   ```

## 🔧 Configuration

### API Keys Setup

#### Google Gemini API
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `GEMINI_API_KEY`

#### BrightData API
1. Sign up at [BrightData](https://brightdata.com/)
2. Get your API key from the dashboard
3. Add it to your `.env` file as `BRIGHTDATA_API_KEY`

### Model Configuration

The system uses Google Gemini 1.5 Flash for AI analysis. You can modify the model in `main.py`:

```python
llm = init_chat_model(
    "gemini-1.5-pro",  # Change model here
    model_provider="google_genai", 
    api_key=os.getenv("GEMINI_API_KEY")
)
```

## 📁 Project Structure

```
DataHopper/
├── main.py                 # Main application and workflow orchestration
├── web_operations.py       # BrightData API integration for web scraping
├── snapshot_operations.py  # Handles BrightData snapshot processing
├── prompts.py             # AI prompt templates for different analysis types
├── .env                   # Environment variables (create this)
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🧩 Core Components

### 1. **main.py** - Workflow Orchestration
- Defines the LangGraph workflow
- Manages state between different research phases
- Coordinates parallel search operations
- Handles user interaction

### 2. **web_operations.py** - Data Collection
- **SERP Search**: Google and Bing search via BrightData
- **Reddit Search**: Keyword-based Reddit post discovery
- **Reddit Retrieval**: Detailed post and comment extraction

### 3. **snapshot_operations.py** - Data Processing
- **Snapshot Polling**: Monitors BrightData job completion
- **Data Download**: Retrieves processed research data
- **Error Handling**: Manages API timeouts and failures

### 4. **prompts.py** - AI Analysis Templates
- **Structured Prompts**: Specialized prompts for different sources
- **Analysis Types**: Google facts, Bing perspectives, Reddit community insights
- **Synthesis Logic**: Combines multiple analyses into coherent answers

## 🎯 Usage Examples

### Basic Research Query
```
Ask me anything: invest in nvidia

Starting parallel research process...
Launching Google, Bing, and Reddit searches...

Searching Google for: invest in nvidia
Searching Bing for: invest in nvidia  
Searching Reddit for: invest in nvidia
...
Final Answer: [Comprehensive analysis from all sources]
```

### Research Process Flow
1. **Parallel Search**: Simultaneously queries Google, Bing, and Reddit
2. **Reddit Analysis**: AI selects most relevant Reddit discussions
3. **Content Retrieval**: Downloads detailed Reddit post content
4. **Source Analysis**: Separate AI analysis for each source type
5. **Synthesis**: Combines insights into a final comprehensive answer

## 🛠️ Advanced Configuration

### Custom Search Parameters

**Reddit Search Customization**:
```python
reddit_results = reddit_search_api(
    keyword=user_question,
    date="All time",        # Options: "All time", "Past year", etc.
    sort_by="Hot",          # Options: "Hot", "New", "Top"
    num_of_posts=75         # Number of posts to retrieve
)
```

**Reddit Post Retrieval**:
```python
reddit_post_data = reddit_post_retrieval(
    urls=selected_urls,
    days_back=10,           # How far back to look for comments
    load_all_replies=False, # Whether to load all comment threads
    comment_limit=""        # Limit number of comments
)
```

### BrightData Zones
The system uses BrightData zones for different operations:
- **SERP Search**: `ai_agent_1` zone
- **Reddit Discovery**: `gd_lvz8ah06191smkebj4` dataset
- **Reddit Retrieval**: `gd_lvzdpsdlw09j6t702` dataset

## 🔍 How It Works

### 1. **Multi-Source Data Collection**
- **Google**: Authoritative sources, official information, statistics
- **Bing**: Microsoft ecosystem perspectives, technical documentation
- **Reddit**: Community experiences, real user opinions, discussions

### 2. **AI-Powered Analysis**
Each source gets specialized analysis:
- **Google Analysis**: Facts, official sources, verified information
- **Bing Analysis**: Technical details, enterprise perspectives
- **Reddit Analysis**: User experiences, community consensus, practical tips

### 3. **Intelligent Synthesis**
The final step combines all analyses to provide:
- Balanced perspectives from multiple sources
- Identification of common themes and contradictions
- Source attribution for key claims
- Comprehensive answer addressing the original question

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you encounter any issues or have questions:

1. Check the existing [issues](https://github.com/PreMob/DataHopper/issues)
2. Create a new issue with detailed information
3. Provide your environment details and error messages

## 🔮 Future Enhancements

- [ ] Add more search engines (DuckDuckGo, Yahoo)
- [ ] Support for image and video search
- [ ] Export results to different formats (PDF, JSON)
- [ ] Web interface for easier interaction
- [ ] Caching system for faster repeated queries
- [ ] Custom source weighting and preferences

---

**DataHopper** - *Hop across data sources for comprehensive research* 🐇