from dotenv import load_dotenv
from typing import Annotated, List
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
import google.generativeai as genai
from typing_extensions import TypedDict
from pydantic import BaseModel, Field
import os
from web_operations import serp_search, reddit_search_api, reddit_post_retrieval
from prompts import (
    get_reddit_analysis_messages,
    get_google_analysis_messages,
    get_bing_analysis_messages,
    get_reddit_url_analysis_messages,
    get_synthesis_messages
    )
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from contextlib import asynccontextmanager

load_dotenv()

# Initialize Gemini model
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
llm = genai.GenerativeModel('gemini-1.5-flash')

class State(TypedDict):
    messages: Annotated[list, add_messages]
    user_question: str | None
    google_results: str | None
    bing_results: str | None
    reddit_results: str | None
    selected_reddit_urls: list[str] | None
    reddit_post_data: list | None
    google_analysis: str | None
    bing_analysis: str | None
    reddit_analysis: str | None
    final_answer: str | None

class RedditURLAnalysis(BaseModel):
    selected_urls: List[str] = Field(description="List of Reddit URLs that contain valuable information for answering the user's question")

# FastAPI app setup
app = FastAPI(title="DataHopper API", description="Multi-source research agent API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Request/Response models
class ResearchRequest(BaseModel):
    question: str = Field(..., description="The research question to answer")

class ResearchResponse(BaseModel):
    final_answer: str
    google_results: dict = None
    bing_results: dict = None
    reddit_results: dict = None
    status: str = "completed"

def google_search(state:State):
    user_question = state.get("user_question", "")
    print(f"Searching Google for: {user_question}")

    google_resutls = serp_search(user_question, engine="google")
    print(google_resutls)

    return {"google_results": google_resutls}

def bing_search(state:State):
    user_question = state.get("user_question", "")
    print(f"Searching Bing for: {user_question}")

    bing_resutls = serp_search(user_question, engine="bing")
    print(bing_resutls)

    return {"bing_results": bing_resutls}

def reddit_search(state:State):
    user_question = state.get("user_question", "")
    print(f"Searching Reddit for: {user_question}")

    reddit_resutls = reddit_search_api(user_question)
    print(reddit_resutls)

    return {"reddit_results": reddit_resutls}

def analyze_reddit_posts(state:State):
    user_question = state.get("user_question", "")
    reddit_results = state.get("reddit_results", "")

    if not reddit_results:
        return {"selected_reddit_urls": []}
    
    messages = get_reddit_url_analysis_messages(user_question, reddit_results)
    system_prompt = messages[0]["content"]
    user_prompt = messages[1]["content"]
    
    response = llm.generate_content(f"{system_prompt}\n\n{user_prompt}\n\nPlease respond with a JSON array of URLs like: [\"url1\", \"url2\"]")
    
    import json
    import re
    
    try:
        # Try to extract URLs from the response
        content = response.text.strip()
        # Look for JSON array in the response
        json_match = re.search(r'\[.*\]', content)
        if json_match:
            selected_urls = json.loads(json_match.group())
        else:
            # Fallback: extract URLs manually
            selected_urls = []
            if reddit_results and "parsed_posts" in reddit_results:
                # Take first few posts as fallback
                posts = reddit_results["parsed_posts"][:3]
                selected_urls = [post.get("url") for post in posts if post.get("url")]
        
        print("Selected URLs:")
        for i, url in enumerate(selected_urls, 1):
            print(f" {i}. {url}")

    except Exception as e:
        print(f"Error parsing URLs: {e}")
        selected_urls = []

    return {"selected_reddit_urls": selected_urls}

def retrieve_reddit_posts(state:State):
    print("Getting reddit post comments")

    selected_urls = state.get("selected_reddit_urls", [])

    if not selected_urls:
        return {"reddit_post_data": []}

    print(f"Processing {len(selected_urls)} Reddit URLs")

    reddit_post_data = reddit_post_retrieval(selected_urls)

    if reddit_post_data:
        print(f"Successfully got {len(reddit_post_data)} posts")
    else:
        print("Failed to get post data")
        reddit_post_data = []

    print(reddit_post_data)
    return {"reddit_post_data": reddit_post_data}

def analyze_google_results(state: State):
    print("Analyzing google search results")

    user_question = state.get("user_question", "")
    google_results = state.get("google_results", "")

    messages = get_google_analysis_messages(user_question, google_results)
    system_prompt = messages[0]["content"]
    user_prompt = messages[1]["content"]
    
    response = llm.generate_content(f"{system_prompt}\n\n{user_prompt}")
    return {"google_analysis": response.text}


def analyze_bing_results(state: State):
    print("Analyzing bing search results")

    user_question = state.get("user_question", "")
    bing_results = state.get("bing_results", "")

    messages = get_bing_analysis_messages(user_question, bing_results)
    system_prompt = messages[0]["content"]
    user_prompt = messages[1]["content"]
    
    response = llm.generate_content(f"{system_prompt}\n\n{user_prompt}")
    return {"bing_analysis": response.text}


def analyze_reddit_results(state: State):
    print("Analyzing reddit search results")

    user_question = state.get("user_question", "")
    reddit_results = state.get("reddit_results", "")
    reddit_post_data = state.get("reddit_post_data", "")

    messages = get_reddit_analysis_messages(user_question, reddit_results, reddit_post_data)
    system_prompt = messages[0]["content"]
    user_prompt = messages[1]["content"]
    
    response = llm.generate_content(f"{system_prompt}\n\n{user_prompt}")
    return {"reddit_analysis": response.text}


def synthesize_analyses(state: State):
    print("Combine all results together")

    user_question = state.get("user_question", "")
    google_analysis = state.get("google_analysis", "")
    bing_analysis = state.get("bing_analysis", "")
    reddit_analysis = state.get("reddit_analysis", "")

    messages = get_synthesis_messages(
        user_question, google_analysis, bing_analysis, reddit_analysis
    )
    system_prompt = messages[0]["content"]
    user_prompt = messages[1]["content"]
    
    response = llm.generate_content(f"{system_prompt}\n\n{user_prompt}")
    final_answer = response.text

    return {"final_answer": final_answer, "messages": [{"role": "assistant", "content": final_answer}]}

graph_builder = StateGraph(State)

graph_builder.add_node("google_search", google_search)
graph_builder.add_node("bing_search", bing_search)
graph_builder.add_node("reddit_search", reddit_search)
graph_builder.add_node("analyze_reddit_posts", analyze_reddit_posts)
graph_builder.add_node("retrieve_reddit_posts", retrieve_reddit_posts)
graph_builder.add_node("analyze_google_results", analyze_google_results)
graph_builder.add_node("analyze_bing_results", analyze_bing_results)
graph_builder.add_node("analyze_reddit_results", analyze_reddit_results)
graph_builder.add_node("synthesize_analyses", synthesize_analyses)

graph_builder.add_edge(START, "google_search")
graph_builder.add_edge(START, "bing_search")
graph_builder.add_edge(START, "reddit_search")

graph_builder.add_edge("google_search","analyze_reddit_posts")
graph_builder.add_edge("bing_search", "analyze_reddit_posts")
graph_builder.add_edge("reddit_search", "analyze_reddit_posts")
graph_builder.add_edge("analyze_reddit_posts", "retrieve_reddit_posts")

graph_builder.add_edge("retrieve_reddit_posts", "analyze_google_results")
graph_builder.add_edge("retrieve_reddit_posts", "analyze_bing_results")
graph_builder.add_edge("retrieve_reddit_posts", "analyze_reddit_results")

graph_builder.add_edge("analyze_google_results", "synthesize_analyses")
graph_builder.add_edge("analyze_bing_results", "synthesize_analyses")
graph_builder.add_edge("analyze_reddit_results", "synthesize_analyses")

graph_builder.add_edge("synthesize_analyses", END )

graph = graph_builder.compile()

# API Endpoints
@app.post("/api/research", response_model=ResearchResponse)
async def research_endpoint(request: ResearchRequest):
    """Perform multi-source research on a given question."""
    try:
        state = {
            "messages":[{"role": "user", "content": request.question}],
            "user_question": request.question,
            "google_results": None,
            "bing_results": None,
            "reddit_results": None,
            "google_analysis": None,
            "bing_analysis": None,
            "reddit_analysis": None,
            "final_answer": None,
        }

        print(f"Starting research for: {request.question}")
        final_state = graph.invoke(state)

        return ResearchResponse(
            final_answer=final_state.get("final_answer", "No answer generated"),
            google_results=final_state.get("google_results"),
            bing_results=final_state.get("bing_results"),
            reddit_results=final_state.get("reddit_results"),
            status="completed"
        )

    except Exception as e:
        print(f"Error during research: {e}")
        raise HTTPException(status_code=500, detail=f"Research failed: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "message": "DataHopper API is running"}

def run_chatbot():
    print("Multi-Source Research Agent")
    print("Type 'exit' to quit\n")

    while True:
        user_input = input("Ask me anything: ")
        if user_input.lower() == "exit":
            print("Bye")
            break

        state = {
            "messages":[{"role": "user", "content":user_input}],
            "user_question": user_input,
            "google_results": None,
            "bing_results": None,
            "reddit_results": None,
            "google_analysis": None,
            "bing_analysis": None,
            "reddit_analysis": None,
            "final_answer": None,
        }

        print("\nStarting parallel research process...")
        print("Launching Googling, Bing, and Reddit searches...\n")
        final_state = graph.invoke(state) #type:ignore

        if final_state.get("final_answer"):
            print(f"\nFinal Answer:\n{final_state.get('final_answer')}\n")

        print("-" * 80)

if __name__ == "__main__":
    import sys
    
    try:
        if len(sys.argv) > 1 and sys.argv[1] == "--api":
            # Run as API server
            port = 8000
            if len(sys.argv) > 2 and sys.argv[2].startswith("--port="):
                try:
                    port = int(sys.argv[2].split("=")[1])
                except ValueError:
                    print("Invalid port number, using default 8000")
            
            print(f"Starting DataHopper API server on port {port}...")
            print("API endpoints:")
            print(f"  - Health check: http://127.0.0.1:{port}/api/health")
            print(f"  - Research: http://127.0.0.1:{port}/api/research")
            print(f"  - API docs: http://127.0.0.1:{port}/docs")
            uvicorn.run(app, host="127.0.0.1", port=port)
        else:
            # Run as CLI chatbot
            run_chatbot()
    except Exception as e:
        print(f"Error starting server: {e}")
        import traceback
        traceback.print_exc()